import { db } from "@/db";
import { repositories } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { targetDomain, globalInstructions, repoId, userId } = await req.json();
        console.log(repoId, userId)

        const result = await db.update(repositories).set({
            targetDomain: targetDomain,
            globalInstructions: globalInstructions
        }).where(and(eq(repositories.repoId, repoId), eq(repositories.userId, userId))).returning();
        if (result.length === 0) return NextResponse.json({ message: "Error in updating repo" }, { status: 400 });
        return NextResponse.json(result[0]);
    } catch (error) {
        console.log("Error in updating repo: ", error);
        return NextResponse.json({ message: "Error in updating repo" }, { status: 500 });
    }
}