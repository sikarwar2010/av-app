"use client";

import React from 'react'
import { RoleGuard } from '@/components/auth/role-guard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useQuery } from 'convex/react'
import { useUser } from '@clerk/nextjs'
import { api } from '@/convex/_generated/api'
import { USER_ROLES, ROLE_PERMISSIONS, type UserRole } from '@/lib/types'
import {
    Users,
    Building2,
    Contact,
    Target,
    BarChart3,
    Settings,
    Shield,
    TrendingUp,
    Activity
} from 'lucide-react'
import Link from 'next/link'

const Dashboard = () => {
    const { user } = useUser()
    const currentUser = useQuery(
        api.users.getCurrentUser,
        user ? { clerkId: user.id } : "skip"
    )

    return (
        <RoleGuard
            fallback={
                <div className="flex items-center justify-center min-h-[50vh]">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-center">Access Required</CardTitle>
                            <CardDescription className="text-center">
                                You need appropriate permissions to access the dashboard.
                                Please contact your administrator.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            }
            showLoading
        >
            <div className="space-y-6">
                {/* Welcome Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back{currentUser ? `, ${currentUser.firstName}` : ''}!
                    </h1>
                    <p className="text-muted-foreground">
                        {currentUser && (
                            <span className="capitalize">
                                {currentUser.role === USER_ROLES.OWNER && "Owner Dashboard"}
                                {currentUser.role === USER_ROLES.ADMIN && "Administrator Dashboard"}
                                {currentUser.role === USER_ROLES.MANAGER && "Manager Dashboard"}
                                {currentUser.role === USER_ROLES.SALES && "Sales Dashboard"}
                                {currentUser.role === USER_ROLES.VIEWER && "Viewer Dashboard"}
                            </span>
                        )} - AV Valve Ltd CRM
                    </p>
                </div>

                {/* Role-Based Quick Actions */}
                {currentUser && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Core CRM Cards - Available to all users */}
                        <Link href="/contacts">
                            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Contacts</CardTitle>
                                    <Contact className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground">
                                        Manage your contacts
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/companies">
                            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Companies</CardTitle>
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground">
                                        Company database
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/deals">
                            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Deals</CardTitle>
                                    <Target className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground">
                                        Track opportunities
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Admin-only cards */}
                        {ROLE_PERMISSIONS[currentUser.role as UserRole]?.canManageUsers && (
                            <Link href="/users">
                                <Card className="cursor-pointer hover:shadow-md transition-shadow border-blue-200 bg-blue-50">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-blue-900">User Management</CardTitle>
                                        <Users className="h-4 w-4 text-blue-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xs text-blue-700">
                                            Manage team & roles
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        )}
                    </div>
                )}

                {/* Role-Specific Sections */}
                {currentUser && (
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Admin Overview */}
                        {(currentUser.role === USER_ROLES.OWNER || currentUser.role === USER_ROLES.ADMIN) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-blue-600" />
                                        Administrator Panel
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Link href="/admin">
                                        <Button variant="outline" className="w-full justify-start">
                                            <Settings className="h-4 w-4 mr-2" />
                                            System Administration
                                        </Button>
                                    </Link>
                                    <Link href="/users">
                                        <Button variant="outline" className="w-full justify-start">
                                            <Users className="h-4 w-4 mr-2" />
                                            User Management
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}

                        {/* Manager Overview */}
                        {(currentUser.role === USER_ROLES.OWNER ||
                            currentUser.role === USER_ROLES.ADMIN ||
                            currentUser.role === USER_ROLES.MANAGER) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart3 className="h-5 w-5 text-green-600" />
                                            Management Tools
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Button variant="outline" className="w-full justify-start" disabled>
                                            <TrendingUp className="h-4 w-4 mr-2" />
                                            Advanced Reports (Coming Soon)
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start" disabled>
                                            <Activity className="h-4 w-4 mr-2" />
                                            Team Analytics (Coming Soon)
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                        {/* Sales Overview */}
                        {currentUser.role === USER_ROLES.SALES && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5 text-orange-600" />
                                        Sales Dashboard
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Focus on your deals and contacts to drive revenue.
                                    </p>
                                    <div className="space-y-2">
                                        <Link href="/deals">
                                            <Button variant="outline" className="w-full justify-start">
                                                <Target className="h-4 w-4 mr-2" />
                                                My Deals
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Viewer Overview */}
                        {currentUser.role === USER_ROLES.VIEWER && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-gray-600" />
                                        View Access
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        You have view-only access to the system. Contact your administrator
                                        if you need additional permissions.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </RoleGuard>
    )
}

export default Dashboard

