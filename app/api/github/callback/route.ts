import { NextRequest, NextResponse } from "next/server";

export { } from "next/server"
export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');
    if (!code) return NextResponse.redirect(new URL('/workspace?error=missing-code', req.url), 302);
    const redirectUri = process.env.GITHUB_REDIRECT_URL || new URL(
        "/api/github/callback",
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ).toString()

    const res = await fetch('https://github.com/login/oauth/access_token', {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded", Accept: 'application/json' },
        body: new URLSearchParams({
            client_id: process.env.GITHUB_CLIENT_ID || '',
            client_secret: process.env.GITHUB_CLIENT_SECRET || '',
            code: code,
            redirect_uri: redirectUri,
        }).toString()
    })

    const data: any = await res.json()
    const token = data.access_token
    if (!token) return NextResponse.redirect(new URL(`/workspace?error=missing-token`, req.url), 302);

    const response = NextResponse.redirect(new URL('/workspace', req.url))
    // store token in http only cookie
    response.cookies.set('gh-token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
    })

    return response;
}