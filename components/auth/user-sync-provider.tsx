"use client"

import type React from "react"

import { useUserSync } from "@/hooks/use-user-sync"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UserSyncProviderProps {
    children: React.ReactNode
}

/**
 * Provider component that ensures user is synced before rendering children
 * This prevents issues where components try to access user data before sync
 */
export function UserSyncProvider({ children }: UserSyncProviderProps) {
    const { user, isLoading, syncError } = useUserSync()

    // Show error state if sync failed
    if (syncError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4 text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Setup Error</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            There was an issue setting up your account. Please try refreshing the page.
                        </p>
                        <p className="text-xs text-red-600">{syncError}</p>
                    </div>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        Refresh Page
                    </Button>
                </div>
            </div>
        )
    }

    // Show loading state while syncing user
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Setting up your account...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
