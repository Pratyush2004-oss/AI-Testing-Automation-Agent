import { db } from "@/db";
import { users } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const user = await currentUser();
    try {
        const userResult = await db.select().from(users).where(eq(users.email, user?.primaryEmailAddress?.emailAddress ?? "")).limit(1);

        if (userResult.length === 0) {
            // add user to the database
            const newUser = await db.insert(users).values({
                name: user?.firstName ?? "",
                email: user?.primaryEmailAddress?.emailAddress ?? "",
            }).returning();
            return NextResponse.json({ user: newUser[0] });
        }
        else {
            return NextResponse.json({ user: userResult[0] });
        }
    } catch (error) {
        console.log("Error in Creating User: ", error);
        return NextResponse.json({ error: "Error in Creating User" }, { status: 500 });
    }
}