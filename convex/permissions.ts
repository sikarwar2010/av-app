// Permission system for role-based access control

// Available modules in the system
export const MODULES = {
    DASHBOARD: "dashboard",
    CONTACTS: "contacts",
    COMPANIES: "companies",
    DEALS: "deals",
    TASKS: "tasks",
    REPORTS: "reports",
    SETTINGS: "settings",
    TEAM: "team",
    BILLING: "billing",
    AI_FEATURES: "ai_features",
}

// Available actions for each module
export const ACTIONS = {
    VIEW: "view",
    CREATE: "create",
    EDIT: "edit",
    DELETE: "delete",
    EXPORT: "export",
    MANAGE: "manage",
}

// Enhanced role permissions matrix with module-based granular permissions
export const ENHANCED_ROLE_PERMISSIONS = {
    owner: {
        [MODULES.DASHBOARD]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
        [MODULES.CONTACTS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
        [MODULES.COMPANIES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
        [MODULES.DEALS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
        [MODULES.TASKS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
        [MODULES.REPORTS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
        [MODULES.SETTINGS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
        [MODULES.TEAM]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
        [MODULES.BILLING]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
        [MODULES.AI_FEATURES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
    },
    admin: {
        [MODULES.DASHBOARD]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
        [MODULES.CONTACTS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
        [MODULES.COMPANIES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
        [MODULES.DEALS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
        [MODULES.TASKS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
        [MODULES.REPORTS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
        [MODULES.SETTINGS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
        [MODULES.TEAM]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
        [MODULES.BILLING]: [], // No billing access for admin
        [MODULES.AI_FEATURES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT, ACTIONS.MANAGE],
    },
    manager: {
        [MODULES.DASHBOARD]: [ACTIONS.VIEW, ACTIONS.EXPORT],
        [MODULES.CONTACTS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.EXPORT],
        [MODULES.COMPANIES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.EXPORT],
        [MODULES.DEALS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.EXPORT],
        [MODULES.TASKS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.EXPORT],
        [MODULES.REPORTS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EXPORT],
        [MODULES.SETTINGS]: [], // No settings access
        [MODULES.TEAM]: [ACTIONS.VIEW, ACTIONS.MANAGE], // Can manage team members
        [MODULES.BILLING]: [], // No billing access
        [MODULES.AI_FEATURES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT],
    },
    sales: {
        [MODULES.DASHBOARD]: [ACTIONS.VIEW],
        [MODULES.CONTACTS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT], // Own data only
        [MODULES.COMPANIES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT], // Own data only
        [MODULES.DEALS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT], // Own data only
        [MODULES.TASKS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT], // Own data only
        [MODULES.REPORTS]: [ACTIONS.VIEW], // Limited report access
        [MODULES.SETTINGS]: [], // No settings access
        [MODULES.TEAM]: [], // No team management
        [MODULES.BILLING]: [], // No billing access
        [MODULES.AI_FEATURES]: [ACTIONS.VIEW, ACTIONS.CREATE],
    },
    viewer: {
        [MODULES.DASHBOARD]: [ACTIONS.VIEW],
        [MODULES.CONTACTS]: [ACTIONS.VIEW], // Limited view access
        [MODULES.COMPANIES]: [ACTIONS.VIEW], // Limited view access
        [MODULES.DEALS]: [ACTIONS.VIEW], // Limited view access
        [MODULES.TASKS]: [ACTIONS.VIEW], // Limited view access
        [MODULES.REPORTS]: [ACTIONS.VIEW], // Limited report access
        [MODULES.SETTINGS]: [], // No settings access
        [MODULES.TEAM]: [], // No team access
        [MODULES.BILLING]: [], // No billing access
        [MODULES.AI_FEATURES]: [], // No AI features access
    },
}

// Type definitions for enhanced permissions
export type ModuleKey = keyof typeof MODULES
export type ActionKey = keyof typeof ACTIONS
export type RoleKey = keyof typeof ENHANCED_ROLE_PERMISSIONS
export type ModuleValue = typeof MODULES[ModuleKey]
export type ActionValue = typeof ACTIONS[ActionKey]

// Utility functions for permission checking
export function hasPermission(role: string, module: string, action: string): boolean {
    const rolePermissions = ENHANCED_ROLE_PERMISSIONS[role as keyof typeof ENHANCED_ROLE_PERMISSIONS]
    if (!rolePermissions) return false

    const modulePermissions = rolePermissions[module as keyof typeof rolePermissions]
    if (!modulePermissions) return false

    return modulePermissions.includes(action)
}

export function getModulePermissions(role: string, module: string): string[] {
    const rolePermissions = ENHANCED_ROLE_PERMISSIONS[role as RoleKey]
    if (!rolePermissions) return []

    return [...(rolePermissions[module as ModuleValue] || [])]
}

export function getAllPermissions(role: string): Record<string, string[]> {
    const rolePermissions = ENHANCED_ROLE_PERMISSIONS[role as RoleKey]
    if (!rolePermissions) return {}

    const result: Record<string, string[]> = {}
    for (const [module, permissions] of Object.entries(rolePermissions)) {
        result[module] = [...permissions]
    }
    return result
}
