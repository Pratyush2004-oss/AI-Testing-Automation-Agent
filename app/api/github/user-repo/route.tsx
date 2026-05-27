import { db } from "@/db";
import { repositories } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { id, userId, name, full_name, owner, description, isPrivate, html_url, updated_at, language, default_branch } = await req.json();
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