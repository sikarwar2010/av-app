"use client"

import { UserManagementDashboard } from "@/components/user-managements/user-management-dashboard"
import { RoleGuard } from "@/components/auth/role-guard"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { USER_ROLES } from "@/lib/types"

export default function UsersPage() {
    const router = useRouter()

    return (
        <RoleGuard
            roles={[USER_ROLES.OWNER, USER_ROLES.ADMIN]}
            fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <CardTitle>Access Restricted</CardTitle>
                            <CardDescription className="mb-4">
                                You need administrator privileges to access user management.
                                This feature is restricted to owners and administrators only.
                            </CardDescription>
                            <Button
                                onClick={() => router.push('/dashboard')}
                                variant="outline"
                                className="w-full"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </CardHeader>
                    </Card>
                </div>
            }
            showLoading
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
