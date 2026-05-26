import { NextResponse } from "next/server"

export async function GET() {
    const redirectUri = process.env.GITHUB_REDIRECT_URL || new URL(
        "/api/github/callback",
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ).toString()

    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        redirect_uri: redirectUri,
        scope: "repo read:user"
    })
    return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`, 302)
}