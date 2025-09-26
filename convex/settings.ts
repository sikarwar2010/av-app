import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Get company settings
export const getCompanySettings = query({
    args: {},
    handler: async (ctx, args) => {
        const settings = await ctx.db.query("companySettings").first()

        if (!settings) {
            // Return default settings if none exist
            return {
                companyName: "Acme Corporation",
                subdomain: "acme",
                industry: "technology",
                timezone: "utc-8",
                description: "",
                emailNotifications: true,
                realTimeUpdates: true,
                weeklyReports: false,
            }
        }

        return settings
    },
})

// Update company settings
export const updateCompanySettings = mutation({
    args: {
        companyName: v.optional(v.string()),
        subdomain: v.optional(v.string()),
        industry: v.optional(v.string()),
        timezone: v.optional(v.string()),
        description: v.optional(v.string()),
        emailNotifications: v.optional(v.boolean()),
        realTimeUpdates: v.optional(v.boolean()),
        weeklyReports: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const existingSettings = await ctx.db.query("companySettings").first()

        if (existingSettings) {
            return await ctx.db.patch(existingSettings._id, {
                ...args,
                updatedAt: Date.now(),
            })
        } else {
            return await ctx.db.insert("companySettings", {
                ...args,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            })
        }
    },
})

// Get team members
export const getTeamMembers = query({
    args: {},
    handler: async (ctx, args) => {
        const users = await ctx.db.query("users").collect()

        return users.map((user) => ({
            ...user,
            lastActive: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never",
            status: user.isActive ? "Active" : "Pending",
        }))
    },
})

// Invite team member
export const inviteTeamMember = mutation({
    args: {
        email: v.string(),
        role: v.string(),
        invitedBy: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const existingUser = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first()

        if (existingUser) {
            throw new Error("User with this email already exists")
        }

        // Create invitation
        const invitationId = await ctx.db.insert("invitations", {
            email: args.email,
            role: args.role,
            invitedBy: args.invitedBy,
            status: "pending",
            createdAt: Date.now(),
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        })

        // In real app, send email invitation here

        return invitationId
    },
})

// Update user role
export const updateUserRole = mutation({
    args: {
        userId: v.id("users"),
        role: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.userId, {
            role: args.role,
            updatedAt: Date.now(),
        })
    },
})

// Remove team member
export const removeTeamMember = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId)
        if (!user) {
            throw new Error("User not found")
        }

        if (user.role === "owner") {
            throw new Error("Cannot remove owner")
        }

        return await ctx.db.delete(args.userId)
    },
})

// Get AI settings
export const getAISettings = query({
    args: {},
    handler: async (ctx, args) => {
        const settings = await ctx.db.query("aiSettings").first()

        if (!settings) {
            return {
                leadScoring: true,
                dealPredictions: true,
                sentimentAnalysis: true,
                smartSuggestions: false,
                reportGeneration: true,
                modelProvider: "openai",
                apiKey: "", // Never return actual API key
                monthlyQueries: 1247,
                predictionAccuracy: 89,
                monthlyCosts: 2.34,
            }
        }

        return {
            ...settings,
            apiKey: "", // Never return actual API key
        }
    },
})

// Update AI settings
export const updateAISettings = mutation({
    args: {
        leadScoring: v.optional(v.boolean()),
        dealPredictions: v.optional(v.boolean()),
        sentimentAnalysis: v.optional(v.boolean()),
        smartSuggestions: v.optional(v.boolean()),
        reportGeneration: v.optional(v.boolean()),
        modelProvider: v.optional(v.string()),
        apiKey: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existingSettings = await ctx.db.query("aiSettings").first()

        if (existingSettings) {
            return await ctx.db.patch(existingSettings._id, {
                ...args,
                updatedAt: Date.now(),
            })
        } else {
            return await ctx.db.insert("aiSettings", {
                ...args,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            })
        }
    },
})

// Get security settings
export const getSecuritySettings = query({
    args: {},
    handler: async (ctx, args) => {
        const settings = await ctx.db.query("securitySettings").first()

        if (!settings) {
            return {
                twoFactorEnabled: true,
                ssoEnabled: false,
                sessionTimeout: "24h",
                dataRetention: "90d",
            }
        }

        return settings
    },
})

// Update security settings
export const updateSecuritySettings = mutation({
    args: {
        twoFactorEnabled: v.optional(v.boolean()),
        ssoEnabled: v.optional(v.boolean()),
        sessionTimeout: v.optional(v.string()),
        dataRetention: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existingSettings = await ctx.db.query("securitySettings").first()

        if (existingSettings) {
            return await ctx.db.patch(existingSettings._id, {
                ...args,
                updatedAt: Date.now(),
            })
        } else {
            return await ctx.db.insert("securitySettings", {
                ...args,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            })
        }
    },
})

// Get audit log
export const getAuditLog = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const activities = await ctx.db
            .query("activities")
            .order("desc")
            .take(args.limit || 50)

        return activities.map((activity) => ({
            action: activity.subject,
            user: activity.owner,
            time: new Date(activity.createdAt).toLocaleString(),
            ip: "192.168.1.1", // Mock IP - in real app, track actual IPs
            details: activity.description,
        }))
    },
})

// Get pending invitations
export const getPendingInvitations = query({
    args: {},
    handler: async (ctx, args) => {
        return await ctx.db
            .query("invitations")
            .filter((q) => q.eq(q.field("status"), "pending"))
            .collect()
    },
})

// Resend invitation
export const resendInvitation = mutation({
    args: {
        invitationId: v.id("invitations"),
    },
    handler: async (ctx, args) => {
        const invitation = await ctx.db.get(args.invitationId)
        if (!invitation) {
            throw new Error("Invitation not found")
        }

        // Update expiry date
        await ctx.db.patch(args.invitationId, {
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
        })

        // In real app, resend email invitation here
        return { success: true }
    },
})

// Cancel invitation
export const cancelInvitation = mutation({
    args: {
        invitationId: v.id("invitations"),
    },
    handler: async (ctx, args) => {
        const invitation = await ctx.db.get(args.invitationId)
        if (!invitation) {
            throw new Error("Invitation not found")
        }

        await ctx.db.delete(args.invitationId)
        return { success: true }
    },
})
