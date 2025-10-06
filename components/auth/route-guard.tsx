"use client"

import { useQuery } from "convex/react"
import { useUser } from "@clerk/nextjs"
import { api } from "@/convex/_generated/api"
import { USER_ROLES, ROLE_PERMISSIONS, type UserRole } from "@/lib/types"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface RouteGuardProps {
    children: React.ReactNode
    requiredRoles?: UserRole[]
    requiredPermission?: keyof (typeof ROLE_PERMISSIONS)[UserRole]
    redirectTo?: string
    fallback?: React.ReactNode
    showLoading?: boolean
}

/**
 * Enterprise-level route guard component that handles role-based access control
 * with proper redirects and fallback handling
 */
export function RouteGuard({
    children,
    requiredRoles,
    requiredPermission,
    redirectTo = "/unauthorized",
    fallback,
    showLoading = true
}: RouteGuardProps) {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const currentUser = useQuery(
        api.users.getCurrentUser,
        user ? { clerkId: user.id } : "skip"
    )

    useEffect(() => {
        // Only perform redirects after auth is loaded and we have user data
        if (!isLoaded || !user || currentUser === undefined) return

        // If no user data in Convex, redirect to sign-in
        if (!currentUser) {
            router.push("/sign-in")
            return
        }

        // Check role-based access
        if (requiredRoles && !requiredRoles.includes(currentUser.role as UserRole)) {
            router.push(redirectTo)
            return
        }

        // Check permission-based access
        if (requiredPermission) {
            const permissions = ROLE_PERMISSIONS[currentUser.role as UserRole]
            if (!permissions[requiredPermission]) {
                router.push(redirectTo)
                return
            }
        }
    }, [isLoaded, user, currentUser, requiredRoles, requiredPermission, redirectTo, router])

    // Show loading state if requested and auth is still loading
    if (!isLoaded && showLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    // Show loading while user data is being fetched from Convex
    if (isLoaded && user && currentUser === undefined && showLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Setting up your account...</p>
                </div>
            </div>
        )
    }

    // Return fallback if user is not authenticated
    if (!user || !currentUser) {
        return fallback || null
    }

    // Check role-based access
    if (requiredRoles && !requiredRoles.includes(currentUser.role as UserRole)) {
        return fallback || null
    }

    // Check permission-based access
    if (requiredPermission) {
        const permissions = ROLE_PERMISSIONS[currentUser.role as UserRole]
        if (!permissions[requiredPermission]) {
            return fallback || null
        }
    }

    return <>{children}</>
}

/**
 * Higher-order component for protecting entire pages
 */
export function withRouteGuard<T extends Record<string, unknown>>(
    Component: React.ComponentType<T>,
    guardProps: Omit<RouteGuardProps, 'children'>
) {
    return function GuardedComponent(props: T) {
        return (
            <RouteGuard {...guardProps}>
                <Component {...props} />
            </RouteGuard>
        )
    }
}

/**
 * Hook to check if user has specific role or permission
 */
export function useRoleCheck() {
    const { user } = useUser()
    const currentUser = useQuery(
        api.users.getCurrentUser,
        user ? { clerkId: user.id } : "skip"
    )

    const hasRole = (role: UserRole | UserRole[]) => {
        if (!currentUser) return false
        const roles = Array.isArray(role) ? role : [role]
        return roles.includes(currentUser.role as UserRole)
    }

    const hasPermission = (permission: keyof (typeof ROLE_PERMISSIONS)[UserRole]) => {
        if (!currentUser) return false
        const permissions = ROLE_PERMISSIONS[currentUser.role as UserRole]
        return permissions[permission] || false
    }

    const isOwner = () => hasRole(USER_ROLES.OWNER)
    const isAdmin = () => hasRole([USER_ROLES.OWNER, USER_ROLES.ADMIN])
    const isManager = () => hasRole([USER_ROLES.OWNER, USER_ROLES.ADMIN, USER_ROLES.MANAGER])

    return {
        currentUser,
        hasRole,
        hasPermission,
        isOwner,
        isAdmin,
        isManager,
        canManageUsers: hasPermission('canManageUsers'),
        canViewAllData: hasPermission('canViewAllData'),
        canEditAllData: hasPermission('canEditAllData'),
        canDeleteData: hasPermission('canDeleteData'),
        canManageSettings: hasPermission('canManageSettings')
    }
}
