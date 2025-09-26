"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, X, Crown } from "lucide-react"
import { ENHANCED_ROLE_PERMISSIONS, MODULES, ACTIONS } from "@/convex/permissions"
import { Doc } from "@/convex/_generated/dataModel"

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

interface UserPermissionsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: Doc<"users"> | null
}

export function UserPermissionsDialog({ open, onOpenChange, user }: UserPermissionsDialogProps) {
    if (!user) return null

    const userPermissions = ENHANCED_ROLE_PERMISSIONS[user.role as keyof typeof ENHANCED_ROLE_PERMISSIONS]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        User Permissions
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Detailed view of permissions and module access for this user.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* User Info */}
                    <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={user.imageUrl || "/placeholder.svg"} />
                            <AvatarFallback>
                                {user.firstName.charAt(0)}
                                {user.lastName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-white font-medium">
                                    {user.firstName} {user.lastName}
                                </h3>
                                {user.role === "owner" && <Crown className="h-4 w-4 text-yellow-400" />}
                            </div>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                            <Badge
                                variant="outline"
                                className={`mt-1 ${user.role === "owner"
                                    ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                    : user.role === "admin"
                                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                                        : user.role === "manager"
                                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                            : user.role === "sales"
                                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                                    }`}
                            >
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                        </div>
                    </div>

                    {/* Permissions Matrix */}
                    <div className="space-y-4">
                        <h4 className="text-white font-medium">Module Permissions</h4>
                        <div className="grid gap-4">
                            {Object.entries(MODULES).map(([key, module]) => {
                                const modulePermissions = userPermissions?.[module] || []
                                const hasAnyPermission = modulePermissions.length > 0

                                return (
                                    <Card key={module} className="bg-gray-700/30 border-gray-600">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-white text-base flex items-center gap-2">
                                                <span className="text-lg">{moduleIcons[module as keyof typeof moduleIcons]}</span>
                                                {module.charAt(0).toUpperCase() + module.slice(1).replace("_", " ")}
                                                {!hasAnyPermission && (
                                                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-xs">
                                                        No Access
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                                {Object.values(ACTIONS).map((action) => {
                                                    const hasPermission = modulePermissions.includes(action)
                                                    return (
                                                        <div
                                                            key={action}
                                                            className={`flex items-center gap-2 p-2 rounded text-sm ${hasPermission
                                                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                                                : "bg-gray-600/30 text-gray-500"
                                                                }`}
                                                        >
                                                            {hasPermission ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                                            {actionLabels[action as keyof typeof actionLabels]}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>

                    {/* Permission Summary */}
                    <Card className="bg-gray-700/30 border-gray-600">
                        <CardHeader>
                            <CardTitle className="text-white text-base">Permission Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-400">
                                        {
                                            Object.values(userPermissions || {})
                                                .flat()
                                                .filter((p) => p === ACTIONS.VIEW).length
                                        }
                                    </div>
                                    <div className="text-gray-400">View Access</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-400">
                                        {
                                            Object.values(userPermissions || {})
                                                .flat()
                                                .filter((p) => p === ACTIONS.CREATE).length
                                        }
                                    </div>
                                    <div className="text-gray-400">Create Access</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-400">
                                        {
                                            Object.values(userPermissions || {})
                                                .flat()
                                                .filter((p) => p === ACTIONS.EDIT).length
                                        }
                                    </div>
                                    <div className="text-gray-400">Edit Access</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-400">
                                        {
                                            Object.values(userPermissions || {})
                                                .flat()
                                                .filter((p) => p === ACTIONS.DELETE).length
                                        }
                                    </div>
                                    <div className="text-gray-400">Delete Access</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end">
                    <Button onClick={() => onOpenChange(false)} className="bg-gray-600 hover:bg-gray-700">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
