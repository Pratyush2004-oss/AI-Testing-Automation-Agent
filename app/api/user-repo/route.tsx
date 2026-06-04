import { db } from "@/db";
import { repositories } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { id, userId, name, full_name, owner, description, isPrivate, html_url, updated_at, language, default_branch } = await req.json();

    // check if the repo already exists in the database
    const repo = await db.select().from(repositories).where(and(eq(repositories.repoId, id), eq(repositories.userId, userId))).limit(1);
    if (repo.length > 0) return NextResponse.json({ error: "Repo already exists" }, { status: 400 });

    const response = await db.insert(repositories).values({
        fullName: full_name,
        htmlUrl: html_url,
        isPrivate,
        name,
        owner,
        repoId: id,
        updatedAt: new Date(updated_at),
        userId: userId,
        description,
        language,
        default_branch
    }).returning();
    return NextResponse.json(response[0]);
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const result = await db.select().from(repositories).where(eq(repositories.userId, Number(userId)));

    return NextResponse.json(result);

}