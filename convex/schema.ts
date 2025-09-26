import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    users: defineTable({
        clerkId: v.string(),
        email: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        imageUrl: v.optional(v.string()),
        role: v.string(), // "owner", "admin", "manager", "sales", "viewer"
        isActive: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_clerk_id", ["clerkId"])
        .index("by_email", ["email"])
        .index("by_role", ["role"]),

    // Team Invitations table
    invitations: defineTable({
        email: v.string(),
        role: v.string(),
        invitedBy: v.string(),
        status: v.string(), // "pending", "accepted", "expired"
        createdAt: v.number(),
        expiresAt: v.number(),
    })
        .index("by_email", ["email"])
        .index("by_status", ["status"]),
})
