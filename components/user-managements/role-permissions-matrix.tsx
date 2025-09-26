"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Crown, Shield, Briefcase, Users, Eye } from "lucide-react"
import { ENHANCED_ROLE_PERMISSIONS, MODULES, ACTIONS } from "@/convex/permissions"

const roleInfo = {
    owner: {
        label: "Owner",
        icon: Crown,
        color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        description: "Full access to everything including billing and ownership transfer",
    },
    admin: {
        label: "Admin",
        icon: Shield,
        color: "bg-red-500/10 text-red-500 border-red-500/20",
        description: "Full access except billing/ownership management",
    },
    manager: {
        label: "Sales Manager",
        icon: Briefcase,
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        description: "Can manage team members and view all data, but limited editing",
    },
    sales: {
        label: "Sales Rep",
        icon: Users,
        color: "bg-green-500/10 text-green-500 border-green-500/20",
        description: "Basic access to contacts, deals, and tasks (own data only)",
    },
    viewer: {
        label: "Viewer",
        icon: Eye,
        color: "bg-gray-500/10 text-gray-500 border-gray-500/20",
        description: "Read-only access to limited data",
    },
}

const moduleIcons = {
    dashboard: "📊",
    contacts: "👥",
    companies: "🏢",
    deals: "💼",
    tasks: "✅",
    reports: "📈",
    settings: "⚙️",
    team: "👨‍👩‍👧‍👦",
    billing: "💳",
    ai_features: "🤖",
}

const actionLabels = {
    view: "View",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    export: "Export",
    manage: "Manage",
}

export function RolePermissionsMatrix() {
    return (
        <div className="space-y-6">
            {/* Role Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(roleInfo).map(([roleKey, role]) => {
                    const Icon = role.icon
                    const permissions = ENHANCED_ROLE_PERMISSIONS[roleKey as keyof typeof ENHANCED_ROLE_PERMISSIONS]
                    const totalPermissions = Object.values(permissions || {}).flat().length

                    return (
                        <Card key={roleKey} className="bg-gray-700/30 border-gray-600">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    <Icon className="h-5 w-5 text-gray-400" />
                                    <CardTitle className="text-white text-base">{role.label}</CardTitle>
                                </div>
                                <Badge variant="outline" className={role.color}>
                                    {totalPermissions} Permissions
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400 text-sm">{role.description}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Detailed Permissions Matrix */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white">Detailed Permissions Matrix</CardTitle>
                    <p className="text-gray-400 text-sm">Complete overview of what each role can access across all modules</p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {Object.entries(MODULES).map(([key, module]) => (
                            <div key={module} className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{moduleIcons[module as keyof typeof moduleIcons]}</span>
                                    <h4 className="text-white font-medium">
                                        {module.charAt(0).toUpperCase() + module.slice(1).replace("_", " ")}
                                    </h4>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-700">
                                                <th className="text-left text-gray-400 text-sm font-medium py-2 w-24">Role</th>
                                                {Object.values(ACTIONS).map((action) => (
                                                    <th key={action} className="text-center text-gray-400 text-sm font-medium py-2 px-3">
                                                        {actionLabels[action as keyof typeof actionLabels]}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(roleInfo).map(([roleKey, role]) => {
                                                const permissions = ENHANCED_ROLE_PERMISSIONS[roleKey as keyof typeof ENHANCED_ROLE_PERMISSIONS]
                                                const modulePermissions = permissions?.[module] || []
                                                const Icon = role.icon

                                                return (
                                                    <tr key={roleKey} className="border-b border-gray-700/50">
                                                        <td className="py-3">
                                                            <div className="flex items-center gap-2">
                                                                <Icon className="h-4 w-4 text-gray-400" />
                                                                <span className="text-white text-sm">{role.label}</span>
                                                            </div>
                                                        </td>
                                                        {Object.values(ACTIONS).map((action) => {
                                                            const hasPermission = modulePermissions.includes(action)
                                                            return (
                                                                <td key={action} className="text-center py-3 px-3">
                                                                    {hasPermission ? (
                                                                        <Check className="h-4 w-4 text-green-400 mx-auto" />
                                                                    ) : (
                                                                        <X className="h-4 w-4 text-gray-600 mx-auto" />
                                                                    )}
                                                                </td>
                                                            )
                                                        })}
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
