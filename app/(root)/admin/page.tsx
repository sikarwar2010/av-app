"use client"

import { RoleGuard } from "@/components/auth/role-guard"
import { UserManagementDashboard } from "@/components/user-managements/user-management-dashboard"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Settings, BarChart3 } from "lucide-react"
import { USER_ROLES } from "@/lib/types"

export default function AdminPage() {
    return (
        <RoleGuard
            roles={[USER_ROLES.OWNER, USER_ROLES.ADMIN]}
            fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <CardTitle>Admin Access Required</CardTitle>
                            <CardDescription>
                                You need administrator privileges to access this page.
                                Contact your system administrator if you believe this is an error.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            }
            showLoading
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Administration</h1>
                        <p className="text-muted-foreground">
                            System administration and user management for AV Valve Ltd
                        </p>
                    </div>
                </div>

                {/* Admin Overview Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">User Management</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardDescription className="pt-2">
                            Manage user accounts, roles, and permissions across the organization
                        </CardDescription>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Settings</CardTitle>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardDescription className="pt-2">
                            Configure system-wide settings and organizational preferences
                        </CardDescription>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Analytics</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardDescription className="pt-2">
                            Monitor system performance and user activity metrics
                        </CardDescription>
                    </Card>
                </div>

                {/* User Management Section */}
                <UserManagementDashboard />
            </div>
        </RoleGuard>
    )
}
