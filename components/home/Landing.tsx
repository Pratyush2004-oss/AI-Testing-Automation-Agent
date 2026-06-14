'use client'

import Link from 'next/link'
import { ArrowRight, Bot, CheckCircle2, FolderPlus, Github, Layers3, PlayCircle, ShieldCheck, Sparkles, Video } from 'lucide-react'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const navItems = [
    { label: 'Home', href: '#' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
]

const featureCards = [
    {
        icon: Bot,
        title: 'AI-powered test creation',
        description: 'Generate meaningful test cases from product context, user stories, and existing application behavior.',
    },
    {
        icon: Layers3,
        title: 'Unified execution workflow',
        description: 'Run test suites, capture outcomes, and keep the full workflow inside a single workspace.',
    },
    {
        icon: ShieldCheck,
        title: 'Reliable quality signals',
        description: 'Track failures, compare runs, and surface the signal your team needs to move faster with confidence.',
    },
]

const pricingTiers = [
    {
        name: 'Starter',
        price: '₹0',
        description: 'For trying the agent and validating a workflow. Provides you 2000 credits',
        items: ['Basic test generation', 'Limited workspace access', 'Community support'],
    },
    {
        name: 'Pro',
        price: '₹99',
        description: 'For builders shipping test automation every day. Provides you 2000 extra credits',
        items: ['Unlimited test generation', 'Workspace dashboard', 'Priority support'],
        featured: true,
    },
    {
        name: 'Team',
        price: '₹249',
        description: 'For larger teams with shared testing operations. Provides you 5000 extra credits',
        items: ['Multi-user access', 'Advanced reporting', 'Dedicated onboarding'],
    },
]

const workflowSteps = [
    {
        icon: Github,
        title: 'Connect GitHub account',
        description: 'Link your GitHub account securely so the agent can read the context it needs to understand your product.',
    },
    {
        icon: FolderPlus,
        title: 'Add repos to the portal',
        description: 'Select the repositories you want to monitor, organize, and generate tests for inside the workspace.',
    },
    {
        icon: Bot,
        title: 'Generate test cases',
        description: 'Let the AI generate strong test cases from repository structure, app flows, and product behavior.',
    },
    {
        icon: PlayCircle,
        title: 'Run the test cases',
        description: 'Execute the generated cases and capture results, traces, and failures in one place.',
    },
    {
        icon: Video,
        title: 'View logs and videos in BrowserBase Script',
        description: 'Review execution logs and session recordings to debug faster and keep your workflow audit-ready.',
    },
]

const Landing = () => {
    const { isSignedIn } = useUser()

    return (
        <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_30%),linear-gradient(180deg,rgba(2,6,23,0.96)_0%,rgba(9,9,11,1)_55%,rgba(9,9,11,1)_100%)]" />
            <div className="absolute inset-x-0 top-0 -z-10 h-px bg-linear-to-r from-transparent via-cyan-400/70 to-transparent" />

            <header className="sticky top-0 z-20 border-b border-white/10 bg-background/70 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold tracking-[0.18em] text-cyan-300 uppercase">AI Testing Agent</p>
                            <p className="text-xs text-muted-foreground">Automate test creation and execution</p>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        {navItems.map((item) => (
                            <a key={item.label} href={item.href} className="text-sm text-muted-foreground transition hover:text-foreground">
                                {item.label}
                            </a>
                        ))}
                        {isSignedIn ? (
                            <Link href="/workspace" className="text-sm text-foreground transition hover:text-cyan-300">
                                Workspace
                            </Link>
                        ) : null}
                    </nav>

                    <div className="flex items-center gap-3">
                        {!isSignedIn ? (
                            <>
                                <SignInButton>
                                    <Button variant="ghost" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline-flex">
                                        Login
                                    </Button>
                                </SignInButton>
                                <SignUpButton>
                                    <Button className="bg-cyan-400 px-5 text-slate-950 hover:bg-cyan-300">Sign Up</Button>
                                </SignUpButton>
                            </>
                        ) : (
                            <>
                                <Button asChild variant="outline" className="border-white/10 bg-white/5 text-foreground hover:bg-white/10">
                                    <Link href="/workspace">Workspace</Link>
                                </Button>
                                <div className="rounded-full border border-white/10 bg-white/5 p-1">
                                    <UserButton />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <section className="mx-auto grid max-w-7xl gap-16 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-32 lg:pt-24">
                <div className="flex flex-col justify-center">
                    <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
                        <CheckCircle2 className="h-4 w-4" />
                        Built for AI-assisted testing teams
                    </div>

                    <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                        AI Testing Automation Agent for faster, smarter QA workflows.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                        Generate test cases, run execution flows, and review outcomes in one dark, focused workspace designed for modern product teams.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        {!isSignedIn ? (
                            <>
                                <SignUpButton>
                                    <Button size="lg" className="bg-cyan-400 px-6 text-slate-950 hover:bg-cyan-300">
                                        Get Started
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </SignUpButton>
                                <SignInButton>
                                    <Button size="lg" variant="outline" className="border-white/10 bg-white/5 px-6 text-foreground hover:bg-white/10">
                                        Login
                                    </Button>
                                </SignInButton>
                            </>
                        ) : (
                            <Button asChild size="lg" className="bg-cyan-400 px-6 text-slate-950 hover:bg-cyan-300">
                                <Link href="/workspace">
                                    Open Workspace
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                        <Button asChild size="lg" variant="outline" className="border-white/10 bg-white/5 px-6 text-foreground hover:bg-white/10">
                            <a href="#pricing">View Pricing</a>
                        </Button>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-3">
                        {[
                            ['10x', 'faster test drafting'],
                            ['1 workspace', 'for generation and execution'],
                            ['Dark UI', 'consistent with the app shell'],
                        ].map(([value, label]) => (
                            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                                <p className="text-2xl font-semibold text-cyan-300">{value}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <Card className="border-white/10 bg-white/5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">Project Overview</CardTitle>
                        <CardDescription className="text-base text-muted-foreground">
                            A centralized AI testing agent that helps teams move from idea to validated tests quickly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-background/60 p-4">
                            <p className="text-sm text-cyan-300">Name</p>
                            <p className="mt-1 text-lg font-medium">AI Testing Automation Agent</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-background/60 p-4">
                            <p className="text-sm text-cyan-300">Description</p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Build test cases with AI, run them against your app flows, and keep your testing operations organized in one place.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                { label: 'Automation', value: 'Generate and refine tests' },
                                { label: 'Visibility', value: 'Track runs and results' },
                            ].map((item) => (
                                <div key={item.label} className="rounded-2xl border border-white/10 bg-background/60 p-4">
                                    <p className="text-sm text-muted-foreground">{item.label}</p>
                                    <p className="mt-1 text-sm font-medium">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section id="features" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
                <div className="mb-10 max-w-2xl">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">Features</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Everything you need to run AI-powered testing.</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {featureCards.map((feature) => {
                        const Icon = feature.icon
                        return (
                            <Card key={feature.title} className="border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10">
                                <CardHeader>
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </section>

            <section id="workflow" className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
                <div className="mb-10 max-w-2xl">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">Workflow</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A polished flow from GitHub sync to actionable video review.</h2>
                    <p className="mt-4 text-base leading-7 text-muted-foreground">
                        The experience is designed to feel guided and visual, so users always know what happens next in the testing journey.
                    </p>
                </div>

                <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-8">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%)]" />
                    <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl animate-pulse" />
                    <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl animate-pulse [animation-delay:1200ms]" />

                    <div className="relative ml-2 space-y-5 sm:ml-4">
                        <div className="pointer-events-none absolute left-5.5 top-2 hidden h-[calc(100%-1rem)] w-px bg-linear-to-b from-cyan-400/70 via-cyan-300/30 to-transparent sm:block" />

                        {workflowSteps.map((step, index) => {
                            const Icon = step.icon

                            return (
                                <div key={step.title} className="relative grid gap-4 sm:grid-cols-[56px_1fr] sm:gap-6">
                                    <div className="relative flex items-start justify-center sm:pt-2">
                                        <div className="absolute left-1/2 top-6 hidden h-8 w-px -translate-x-1/2 bg-linear-to-b from-cyan-400/60 to-transparent sm:block" />
                                        <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.16)] transition duration-300 hover:scale-110">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <Card className="group border-white/10 bg-slate-950/50 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-950/70">
                                        <CardHeader className="space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-200/80">Step 0{index + 1}</p>
                                                <CardTitle className="text-xl leading-tight">{step.title}</CardTitle>
                                            </div>
                                            <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200/90">
                                                Workflow
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{step.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>

                    <div className="relative mt-6 grid gap-4 rounded-2xl border border-white/10 bg-background/50 p-4 sm:grid-cols-3">
                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                                <Layers3 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Single source of truth</p>
                                <p className="text-xs text-muted-foreground">GitHub, tests, logs, and recordings stay connected.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Fast debugging loop</p>
                                <p className="text-xs text-muted-foreground">Failures lead directly to the evidence you need.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Audit-ready history</p>
                                <p className="text-xs text-muted-foreground">Every run is easier to inspect and share.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="pricing" className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
                <div className="mb-10 max-w-2xl">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">Pricing</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Choose a plan that fits your testing workflow.</h2>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {pricingTiers.map((tier) => (
                        <Card
                            key={tier.name}
                            className={
                                tier.featured
                                    ? 'border-cyan-400/40 bg-cyan-400/10 shadow-xl shadow-cyan-950/20'
                                    : 'border-white/10 bg-white/5'
                            }
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between gap-4">
                                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                                    {tier.featured ? <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">Most popular</span> : null}
                                </div>
                                <CardDescription className="text-base">{tier.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6 flex items-end gap-2">
                                    <span className="text-4xl font-semibold tracking-tight">{tier.price}</span>
                                    {tier.price !== 'Custom' ? <span className="pb-1 text-sm text-muted-foreground">/month</span> : null}
                                </div>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    {tier.items.map((item) => (
                                        <li key={item} className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </main>
    )
}

export default Landing