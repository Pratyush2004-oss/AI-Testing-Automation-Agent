export type CreditPackage = {
    id: string
    name: string
    description: string
    credits: number
    amountCents: number
    badge?: string
    features: string[]
}

export const creditPackages: CreditPackage[] = [
    {
        id: 'starter',
        name: 'Starter Pack',
        description: 'A quick boost for small test runs and trial projects.',
        credits: 2000,
        amountCents: 99,
        features: ['2000 credits added instantly', 'Best for early testing cycles', 'Stripe secure checkout'],
    },
    {
        id: 'growth',
        name: 'Growth Pack',
        description: 'More credits for frequent execution and team-scale testing.',
        credits: 5000,
        amountCents: 249,
        badge: 'Most Popular',
        features: ['5000 credits added instantly', 'Best value for active teams', 'Stripe secure checkout'],
    },
]

export const getCreditPackage = (packageId: string) => creditPackages.find((item) => item.id === packageId)