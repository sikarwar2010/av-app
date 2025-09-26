import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { ConvexError } from "convex/values"

// User roles with hierarchical permissions
export const USER_ROLES = {
    OWNER: "owner", // Full access to everything
    ADMIN: "admin", // Full access except billing/ownership
    MANAGER: "manager", // Can manage team members and view all data
    SALES: "sales", // Can manage own contacts/deals + view team data
    VIEWER: "viewer", // Read-only access
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

// Role permissions matrix
export const ROLE_PERMISSIONS = {
    [USER_ROLES.OWNER]: {
        canManageUsers: true,
        canManageBilling: true,
        canViewAllData: true,
        canEditAllData: true,
        canDeleteData: true,
        canManageSettings: true,
        canExportData: true,
    },
    [USER_ROLES.ADMIN]: {
        canManageUsers: true,
        canManageBilling: false,
        canViewAllData: true,
        canEditAllData: true,
        canDeleteData: true,
        canManageSettings: true,
        canExportData: true,
    },
    [USER_ROLES.MANAGER]: {
        canManageUsers: false,
        canManageBilling: false,
        canViewAllData: true,
        canEditAllData: true,
        canDeleteData: false,
        canManageSettings: false,
        canExportData: true,
    },
    [USER_ROLES.SALES]: {
        canManageUsers: false,
        canManageBilling: false,
        canViewAllData: false,
        canEditAllData: false,
        canDeleteData: false,
        canManageSettings: false,
        canExportData: false,
    },
    [USER_ROLES.VIEWER]: {
        canManageUsers: false,
        canManageBilling: false,
        canViewAllData: false,
        canEditAllData: false,
        canDeleteData: false,
        canManageSettings: false,
        canExportData: false,
    },
} as const

// Create or update user from Clerk webhook
export const upsertUser = mutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        imageUrl: v.optional(v.string()),
        role: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first()

        const userData = {
            clerkId: args.clerkId,
            email: args.email,
            firstName: args.firstName,
            lastName: args.lastName,
            imageUrl: args.imageUrl,
            role: args.role || USER_ROLES.SALES, // Default role
            isActive: true,
            updatedAt: Date.now(),
        }

        if (existingUser) {
            await ctx.db.patch(existingUser._id, userData)
            return existingUser._id
        } else {
            return await ctx.db.insert("users", {
                ...userData,
                createdAt: Date.now(),
            })
        }
    },
})

// Get current user by Clerk ID
export const getCurrentUser = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first()
    },
})

// Get user by ID
export const getUser = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id)
    },
})

// Get all users (admin only)
export const getUsers = query({
    args: {
        clerkId: v.string(),
        limit: v.optional(v.number()),
        search: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first()

        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const permissions = ROLE_PERMISSIONS[currentUser.role as UserRole]
        if (!permissions.canManageUsers && !permissions.canViewAllData) {
            throw new ConvexError("Insufficient permissions")
        }

        const query = ctx.db.query("users")

        if (args.search) {
            // Filter by name or email
            const users = await query.collect()
            return users
                .filter(
                    (user) =>
                        user.firstName.toLowerCase().includes(args.search!.toLowerCase()) ||
                        user.lastName.toLowerCase().includes(args.search!.toLowerCase()) ||
                        user.email.toLowerCase().includes(args.search!.toLowerCase()),
                )
                .slice(0, args.limit || 50)
        }

        return await query.take(args.limit || 50)
    },
})

// Update user role (admin/owner only)
export const updateUserRole = mutation({
    args: {
        clerkId: v.string(),
        targetUserId: v.id("users"),
        newRole: v.string(),
    },
    handler: async (ctx, args) => {
        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first()

        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const permissions = ROLE_PERMISSIONS[currentUser.role as UserRole]
        if (!permissions.canManageUsers) {
            throw new ConvexError("Insufficient permissions to manage users")
        }

        // Prevent non-owners from creating owners
        if (args.newRole === USER_ROLES.OWNER && currentUser.role !== USER_ROLES.OWNER) {
            throw new ConvexError("Only owners can assign owner role")
        }

        await ctx.db.patch(args.targetUserId, {
            role: args.newRole,
            updatedAt: Date.now(),
        })

        return { success: true }
    },
})

// Deactivate user (admin/owner only)
export const deactivateUser = mutation({
    args: {
        clerkId: v.string(),
        targetUserId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first()

        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const permissions = ROLE_PERMISSIONS[currentUser.role as UserRole]
        if (!permissions.canManageUsers) {
            throw new ConvexError("Insufficient permissions to manage users")
        }

        await ctx.db.patch(args.targetUserId, {
            isActive: false,
            updatedAt: Date.now(),
        })

        return { success: true }
    },
})

// Deactivate user by Clerk ID (for webhook deletion)
export const deactivateUserByClerkId = mutation({
    args: {
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first()

        if (!user) {
            throw new ConvexError("User not found")
        }

        await ctx.db.patch(user._id, {
            isActive: false,
            updatedAt: Date.now(),
        })

        return { success: true }
    },
})

// Check user permissions
export const checkPermissions = query({
    args: {
        clerkId: v.string(),
        permission: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first()

        if (!user) {
            return false
        }

        const permissions = ROLE_PERMISSIONS[user.role as UserRole]
        return permissions[args.permission as keyof typeof permissions] || false
    },
})

// Get team members for current user's scope
export const getTeamMembers = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first()

        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const permissions = ROLE_PERMISSIONS[currentUser.role as UserRole]

        if (permissions.canViewAllData) {
            // Admin/Manager/Owner can see all active users
            return await ctx.db
                .query("users")
                .filter((q) => q.eq(q.field("isActive"), true))
                .collect()
        } else {
            // Sales/Viewer can only see themselves
            return [currentUser]
        }
    },
})
