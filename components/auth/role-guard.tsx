"use client"

import { useQuery } from "convex/react"
import { useUser } from "@clerk/nextjs"
import { api } from "../../convex/_generated/api"
import { ROLE_PERMISSIONS, type UserRole } from "@/lib/types"
import type { ReactNode } from "react"

interface RoleGuardProps {
    children: ReactNode
    permission?: keyof (typeof ROLE_PERMISSIONS)[UserRole]
    roles?: UserRole[]
    fallback?: ReactNode
    showLoading?: boolean
}

export function RoleGuard({
    children,
    permission,
    roles,
    fallback,
    showLoading = false
}: RoleGuardProps) {
    const { user, isLoaded } = useUser()
    const currentUser = useQuery(
        api.users.getCurrentUser,
        user ? { clerkId: user.id } : "skip"
    )

    // Show loading state if requested and auth is still loading
    if (!isLoaded && showLoading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    // Show loading while user data is being fetched from Convex
    if (isLoaded && user && currentUser === undefined && showLoading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    // Return fallback if user is not authenticated
    if (!user) {
        return fallback || null
    }

    // Return fallback if user data is not available in Convex
    if (!currentUser) {
        return fallback || null
    }

    // Check role-based access
    if (roles && !roles.includes(currentUser.role as UserRole)) {
        return fallback || null
    }

    // Check permission-based access
    if (permission) {
        const permissions = ROLE_PERMISSIONS[currentUser.role as UserRole]
        if (!permissions[permission]) {
            return fallback || null
        }
    }

    return <>{children}</>
}
