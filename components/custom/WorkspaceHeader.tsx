'use client'
import { UserButton } from '@clerk/nextjs'
import { BadgeIndianRupee, ChevronRight, CreditCard, LayoutDashboard, Menu, MonitorCheck, Sparkles, X } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useContext, useMemo, useState } from 'react'

import { UserDetailContext } from '@/context/UserDetailContext'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

const WorkspaceHeader = () => {
    const pathname = usePathname()
    const { userDetail } = useContext(UserDetailContext)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navigationItems = [
        {
            name: 'Workspace',
            icon: <MonitorCheck size={24}/>,
            link: "/workspace"
        },
        {
            name: 'Pricing',
            icon: <BadgeIndianRupee size={24} />,
            link: "/workspace/pricing"
        },
        {
            name: 'Support',
            icon: <LayoutDashboard size={24} />,
            link: "/workspace/support"
        },

    ].filter((item, index, items) => index !== items.length - 1 || item.link !== '/workspace/pricing')

    const isActive = (link: string) => {
        if (link === '/workspace') {
            return pathname === '/workspace'
        }
        return pathname?.startsWith(link)
    }

    const mobileActions = useMemo(() => [
        {
            label: 'Open Pricing',
            icon: <BadgeIndianRupee size={18} />,
            link: '/workspace/pricing',
        },
        {
            label: 'Back to Workspace',
            icon: <MonitorCheck size={18} />,
            link: '/workspace',
        },
    ], [])

    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/workspace" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition hover:border-cyan-400/30 hover:bg-white/10">
                    <Image src="/logo-1.png" alt="logo" width={42} height={42} className="rounded-full" />
                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold tracking-[0.16em] text-cyan-300 uppercase">AI Testing Agent</p>
                        <p className="text-xs text-muted-foreground">Workspace navigation</p>
                    </div>
                </Link>

                <nav className="hidden items-center gap-2 md:flex">
                    {navigationItems.map((item) => {
                        const active = isActive(item.link)

                        return (
                            <Link
                                key={item.name}
                                href={item.link}
                                className={cn(
                                    'group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
                                    active
                                        ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.12)]'
                                        : 'border-white/10 bg-white/5 text-muted-foreground hover:border-cyan-400/20 hover:bg-white/10 hover:text-foreground'
                                )}
                            >
                                <span className={cn('transition-transform duration-200 group-hover:scale-110', active ? 'text-cyan-300' : 'text-muted-foreground')}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground">
                        <CreditCard size={16} className="text-cyan-300" />
                        Credits: <span className="font-semibold text-foreground">{userDetail?.credits ?? 2000}</span>
                    </div>

                    <Button asChild variant="outline" className="border-white/10 bg-white/5 text-foreground hover:border-cyan-400/30 hover:bg-cyan-400/10">
                        <Link href="/workspace/pricing">Upgrade Credits</Link>
                    </Button>

                    <div className="rounded-full border border-white/10 bg-white/5 p-1">
                        <UserButton />
                    </div>
                </div>

                <div className="flex items-center gap-2 lg:hidden">
                    <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground sm:flex">
                        <Sparkles size={16} className="text-cyan-300" />
                        {userDetail?.credits ?? 2000}
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setIsMobileMenuOpen((open) => !open)}
                        className="border-white/10 bg-white/5 px-4 text-foreground hover:border-cyan-400/30 hover:bg-cyan-400/10"
                    >
                        {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </Button>
                    <div className="rounded-full border border-white/10 bg-white/5 p-1">
                        <UserButton />
                    </div>
                </div>
            </div>

            <div
                className={cn(
                    'overflow-hidden border-t border-white/10 bg-background/95 px-4 transition-all duration-300 md:hidden',
                    isMobileMenuOpen ? 'max-h-112 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
                )}
            >
                <div className="mx-auto flex max-w-7xl flex-col gap-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {navigationItems.map((item) => {
                            const active = isActive(item.link)

                            return (
                                <Link
                                    key={item.name}
                                    href={item.link}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        'flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200',
                                        active
                                            ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200'
                                            : 'border-white/10 bg-white/5 text-foreground hover:border-cyan-400/20 hover:bg-white/10'
                                    )}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className={cn('text-cyan-300', !active && 'text-muted-foreground')}>{item.icon}</span>
                                        {item.name}
                                    </span>
                                    <ChevronRight size={16} className={cn('transition-transform duration-200', active ? 'translate-x-0 text-cyan-300' : 'text-muted-foreground')} />
                                </Link>
                            )
                        })}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {mobileActions.map((action) => (
                            <Link
                                key={action.label}
                                href={action.link}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-foreground transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
                            >
                                <span className="flex items-center gap-3 text-muted-foreground">
                                    {action.icon}
                                    {action.label}
                                </span>
                                <ChevronRight size={16} className="text-cyan-300" />
                            </Link>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                        <p className="font-semibold">Credits available</p>
                        <p className="mt-1 text-cyan-200/90">{userDetail?.credits ?? 2000} credits ready for testing runs.</p>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default WorkspaceHeader