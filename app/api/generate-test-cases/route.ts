import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { db } from "@/db";
import { TestCaseTable, users } from "@/db/schema";
import { cookies } from "next/headers";
import { eq, sql } from "drizzle-orm";


const ALLOWED_EXTENSIONS = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".json",
  ".md",
];

const IMPORTANT_FILES = [
  "package.json",
  "next.config",
  "middleware",
  "app/",
  "pages/",
  "components/",
  "src/",
  "lib/",
  "utils/",
  "actions/",
  "api/",
  "server/",
];

const IGNORE_PATHS = [
  "node_modules",
  ".next",
  "dist",
  "build",
  ".git",
  "coverage",
  "public/",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".webp",
  ".mp4",
  ".mov",
];

function isUsefulFile(path: string) {
  const isIgnored = IGNORE_PATHS.some((item) => path.includes(item));

  const isAllowedExtension = ALLOWED_EXTENSIONS.some((ext) =>
    path.endsWith(ext)
  );

  const isImportantPath = IMPORTANT_FILES.some((item) =>
    path.includes(item)
  );

  return !isIgnored && isAllowedExtension && isImportantPath;
}

async function getRepoTree({
  owner,
  repo,
  branch,
  githubToken,
}: {
  owner: string;
  repo: string;
  branch: string;
  githubToken: string;
}) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch GitHub repo tree");
  }

  const data = await res.json();

  return data.tree
    .filter((item: any) => item.type === "blob")
    .filter((item: any) => isUsefulFile(item.path))
    .slice(0, 25);
}

async function readGithubFile({
  owner,
  repo,
  path,
  branch,
  githubToken,
}: {
  owner: string;
  repo: string;
  path: string;
  branch: string;
  githubToken: string;
}) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  if (!data.content) {
    return null;
  }

  const decodedContent = Buffer.from(data.content, "base64").toString("utf-8");

  return {
    path,
    content: decodedContent.slice(0, 5000),
  };
}

async function generateContentWithRetry(
  ai: any,
  options: {
    model?: string;
    contents: any;
    config?: any;
  },
  maxRetries = 3,
  fallbackModels = ["gemini-2.0-flash", "gemini-1.5-flash"]
) {
  const modelsToTry = [options.model || "gemini-2.5-flash", ...fallbackModels];
  let lastError = null;

  for (const model of modelsToTry) {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        console.log(`Calling generateContent with model ${model} (attempt ${attempt + 1}/${maxRetries})...`);
        const response = await ai.models.generateContent({
          ...options,
          model: model,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        attempt++;
        const isUnavailable = err.status === "UNAVAILABLE" || err.message?.includes("503") || err.message?.includes("demand");
        const isRateLimit = err.status === "RESOURCE_EXHAUSTED" || err.message?.includes("429") || err.message?.includes("quota");

        if ((isUnavailable || isRateLimit) && attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          console.warn(`Gemini API returned temporary error (${err.message}). Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          console.error(`Gemini API failed for model ${model} on attempt ${attempt}:`, err);
          break; // Try next fallback model
        }
      }
    }
  }
  throw lastError || new Error("Gemini API request failed after retrying.");
}

export async function POST(req: NextRequest) {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });
    const body = await req.json();
    const cookieStore = await cookies();
    const githubToken = cookieStore.get("gh-token")?.value

    const {
      userId,
      repoId,
      owner,
      repo,
      branch = "main",
    } = body;

    if (!userId || !owner || !repo || !githubToken) {
      return NextResponse.json(
        {
          error: "userId, owner, repo and githubToken are required",
        },
        { status: 400 }
      );
    }

    // 1. Get repo tree
    const repoFiles = await getRepoTree({
      owner,
      repo,
      branch,
      githubToken,
    });

    // 2. Read useful files
    const fileContents = await Promise.all(
      repoFiles.map((file: any) =>
        readGithubFile({
          owner,
          repo,
          branch,
          path: file.path,
          githubToken,
        })
      )
    );

    const validFiles = fileContents.filter(Boolean);

    if (validFiles.length === 0) {
      return NextResponse.json(
        {
          error: "No useful source files found in this repository",
        },
        { status: 400 }
      );
    }

    // 3. Prepare compact repo context
    const repoContext = validFiles
      .map(
        (file: any) => `
File Path: ${file.path}

File Content:
${file.content}
`
      )
      .join("\n\n----------------------\n\n");

    // 4. Ask Gemini to generate test cases with metadata
    const prompt = `
You are an expert QA automation engineer.

Analyze the GitHub repository source code and generate useful small test cases.

Your goal:
Generate test cases that can later be converted into Playwright / Browserbase automation scripts.

Repository:
Owner: ${owner}
Repo: ${repo}
Branch: ${branch}

Repository File Context:
${repoContext}

Generate 5 to 10 test cases.

Each test case must include:
- title: clear test case title
- description: one-line description
- type: one of ui, auth, api, form, integration, edge-case
- priority: low, medium, high
- targetRoute: most likely app route/page to test, for example /sign-in, /dashboard, /api/users
- targetFiles: related file paths from the repository context
- expectedResult: what should happen when the test passes

Important rules:
- Only use file paths that exist in the repository context.
- Do not invent fake target files.
- If route is unclear, infer from Next.js app/page structure.
- Keep description short, only one line.
- Return only valid JSON.
`;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            testCases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                  },
                  description: {
                    type: Type.STRING,
                  },
                  type: {
                    type: Type.STRING,
                    enum: [
                      "ui",
                      "auth",
                      "api",
                      "form",
                      "integration",
                      "edge-case",
                    ],
                  },
                  priority: {
                    type: Type.STRING,
                    enum: ["low", "medium", "high"],
                  },
                  targetRoute: {
                    type: Type.STRING,
                  },
                  targetFiles: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.STRING,
                    },
                  },
                  expectedResult: {
                    type: Type.STRING,
                  },
                },
                required: [
                  "title",
                  "description",
                  "type",
                  "priority",
                  "targetRoute",
                  "targetFiles",
                  "expectedResult",
                ],
              },
            },
          },
          required: ["testCases"],
        },
      },
    });

    const aiResult = JSON.parse(response.text || "{}");
    const testCases = aiResult.testCases || [];

    if (!testCases.length) {
      return NextResponse.json(
        {
          error: "Gemini did not generate any test cases",
        },
        { status: 400 }
      );
    }

    // 5. Save generated test cases to Neon DB
    const insertedTestCases = await db
      .insert(TestCaseTable)
      .values(
        testCases.map((testCase: any) => ({
          userId,
          repoId,
          repoName: repo,
          repoOwner: owner,
          branch,

          title: testCase.title,
          description: testCase.description,
          type: testCase.type,
          priority: testCase.priority,

          targetRoute: testCase.targetRoute,
          targetFiles: testCase.targetFiles || [],
          expectedResult: testCase.expectedResult,

          status: "generated",
        }))
      )
      .returning();

      // if test cases generated successfully, then deduct the credits from the user account
      if (insertedTestCases.length > 0) {
        await db
          .update(users)
          .set({ credits: sql`${users.credits} - 200` })
          .where(eq(users.id, userId));
      }

    return NextResponse.json({
      success: true,
      message: "Test cases generated successfully",
      count: insertedTestCases.length,
      testCases: insertedTestCases,
    });
  } catch (error: any) {
    console.error("Generate test cases error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate test cases",
      },
      { status: 500 }
    );
  }
}

