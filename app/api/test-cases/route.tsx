import { db } from "@/db";
import { TestCaseTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = new URL(req.url).searchParams;
    const repoId = searchParams.get("repoId");
    const userId = searchParams.get("userId");

    console.log(repoId, userId)
    if (!repoId || !userId) return NextResponse.json({ error: "Missing repoId or userId" }, { status: 400 });

    const result = await db.select().from(TestCaseTable).where(
        and(
            eq(TestCaseTable.repoId, Number(repoId)),
            eq(TestCaseTable.userId, Number(userId))
        )
    )
    return NextResponse.json(result);
}