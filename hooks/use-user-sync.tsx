"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "../convex/_generated/api"
import { useEffect, useRef } from "react"

/**
 * Custom hook to ensure user is synced between Clerk and Convex
 * This handles cases where users existed before webhook was set up
 */
export function useUserSync() {
    const { user, isLoaded } = useUser()
    const currentUser = useQuery(api.users.getCurrentUser, user ? { clerkId: user.id } : "skip")
    const upsertUser = useMutation(api.users.upsertUser)
    const hasSynced = useRef(false)

    useEffect(() => {
        // Only sync once per session and only if Clerk user is loaded and we don't have a Convex user record
        if (isLoaded && user && !currentUser && !hasSynced.current) {
            console.log("[v0] Syncing user to Convex database:", user.id)
            hasSynced.current = true

            upsertUser({
                clerkId: user.id,
                email: user.primaryEmailAddress?.emailAddress || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                imageUrl: user.imageUrl,
                // Don't pass role for existing users to preserve their current role
                // Only new users will get the default "sales" role
            }).catch((error) => {
                console.error("[v0] Failed to sync user:", error)
                hasSynced.current = false // Reset on error to allow retry
            })
        }
    }, [isLoaded, user, currentUser, upsertUser])

    return {
        user: currentUser,
        isLoading: !isLoaded || (user && !currentUser),
        clerkUser: user,
    }
}
