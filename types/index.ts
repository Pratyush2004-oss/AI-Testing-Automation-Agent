export type REPOTYPE = {
    id: number,
    name: string,
    full_name: string,
    isPrivate: boolean,
    html_url: string,
    description: string | null,
    updated_at: string,
    language: string,
    default_branch: string,
    owner: string
}

export type USERREPOTYPE = {
    id: number;
    name: string,
    fullName: string,
    isPrivate: boolean,
    html_url: string,
    description: string | null,
    updatedAt: string,
    language: string,
    default_branch: string,
    owner: string,
    userId: number,
    repoId: number,
    targetDomain: string,
    globalInstructions: string | null
}

export type TESTCASESTYPE = {
    branch: string
    browserbaseScript: string | null
    createdAt: string
    description: string
    expectedResult: string
    id: number
    priority: "low" | "medium" | "high"
    repoId: number
    repoName: string
    repoOwner: string
    status: string
    targetFiles: string[]
    targetRoute: string
    title: string
    type: string
    userId: number,
    targetDomain: string
}