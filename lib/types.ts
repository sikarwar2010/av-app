// Shared types and constants that can be safely imported in browser code

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
