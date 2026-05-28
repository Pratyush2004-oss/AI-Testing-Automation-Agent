"use client"
import React from 'react'
import { Button } from '../ui/button'

const LoadingSection: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
    const handleRetry = () => {
        if (onRetry) return onRetry()
        // fallback: reload the page to re-run fetch logic in parent
        window.location.reload()
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-700 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Loading repositories</h3>
                    <p className="text-sm text-muted-foreground">Fetching your GitHub repositories. This may take a few seconds.</p>
                </div>
            </div>

            <div className="w-full max-w-2xl mt-4 space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 dark:bg-slate-800 animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-slate-200" />
                            <div className="space-y-2">
                                <div className="h-4 w-40 bg-slate-200 rounded"></div>
                                <div className="h-3 w-24 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                        <div className="h-3 w-16 bg-slate-200 rounded" />
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 mt-4">
                <Button variant={"ghost"} onClick={() => window.history.back()}>Cancel</Button>
                <Button onClick={handleRetry} className="bg-blue-400">Refresh</Button>
            </div>
        </div>
    )
}

export default LoadingSection