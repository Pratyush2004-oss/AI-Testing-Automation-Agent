import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get('gh-token')?.value
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 })

    const allRepo = []
    let page = 1
    while (true) {
        const res = await fetch(`https://api.github.com/user/repos?per_page=50&page=${page}&sort=updated&direction=desc`,
            {
                headers: {
                    Authorization: `token ${token}`,
                    Accept: 'application/vnd.github+json'
                }
            })
        const repos = await res.json();
        if (!repos.length) break;
        allRepo.push(...repos)
        page++
    }
    const filteredRepoData = allRepo.map((r) => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        isPrivate: r.private,
        html_url: r.html_url,
        description: r.description,
        updated_at: r.updated_at,
        language: r.language,
        default_branch: r.default_branch,
        owner: r.owner.login
    }))
    return NextResponse.json(filteredRepoData)

}