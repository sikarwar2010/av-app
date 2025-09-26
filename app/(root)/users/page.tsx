"use client"

import { UserManagementDashboard } from "@/components/user-managements/user-management-dashboard"
import { RoleGuard } from "@/components/auth/role-guard"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"

export default function UsersPage() {
    return (
        <RoleGuard
            permission="canManageUsers"
            fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <CardTitle>Access Restricted</CardTitle>
                            <CardDescription>
                                You dont have permission to access user management. Contact your administrator if you need access to
                                this feature.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">User Management</h1>
                        <p className="text-muted-foreground">
                            Manage team members, roles, and permissions across your organization
                        </p>
                    </div>
                </div>

                {/* User Management Dashboard */}
                <UserManagementDashboard />
            </div>
        </RoleGuard>
    )
}
