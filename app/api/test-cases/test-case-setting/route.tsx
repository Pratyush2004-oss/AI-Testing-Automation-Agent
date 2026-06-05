import { db } from "@/db";
import { TestCaseTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { title, description, repoId, expectedResult, targetRoute, testCaseId } = await req.json();
    
        const result = await db.update(TestCaseTable).set({
            title: title,
            description: description,
            expectedResult: expectedResult,
            targetRoute: targetRoute
        }).where(and(eq(TestCaseTable.repoId, repoId), eq(TestCaseTable.id, testCaseId))).returning();
        if(!result) return NextResponse.json({ error: "Error in updating test case" }, { status: 400 });
        return NextResponse.json(result[0]);
    } catch (error) {
        console.log("Error in updating test case: ", error);
        return NextResponse.json({ error: "Error in updating test case" }, { status: 500 });        
    }
}