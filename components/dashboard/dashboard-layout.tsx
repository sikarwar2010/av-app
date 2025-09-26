"use client";

import type React from "react"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useUserSync } from "@/hooks/use-user-sync"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { RoleGuard } from "@/components/auth/role-guard"
import { ROLE_PERMISSIONS, type UserRole } from "@/lib/types"
import {
    LayoutDashboard,
    Users,
    Building2,
    Target,
    CheckSquare,
    BarChart3,
    Settings,
    Brain,
    Search,
    Bell,
    UserCog,
    type LucideIcon,
} from "lucide-react"

const navigation: Array<{
    name: string
    href: string
    icon: LucideIcon
    current: boolean
    permission?: keyof (typeof ROLE_PERMISSIONS)[UserRole]
}> = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, current: false },
        { name: "Contacts", href: "/contacts", icon: Users, current: false },
        { name: "Companies", href: "/companies", icon: Building2, current: false },
        { name: "Deals", href: "/deals", icon: Target, current: false },
        { name: "Tasks", href: "/tasks", icon: CheckSquare, current: false },
        { name: "Reports", href: "/reports", icon: BarChart3, current: false, permission: "canViewAllData" },
        { name: "User Management", href: "/users", icon: UserCog, current: false, permission: "canManageUsers" },
        { name: "Settings", href: "/settings", icon: Settings, current: false },
    ]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [searchQuery, setSearchQuery] = useState("")
    const { user: clerkUser } = useUser()
    const { user: currentUser } = useUserSync()

    const currentPath = typeof window !== "undefined" ? window.location.pathname : ""
    const updatedNavigation = navigation.map((item) => ({
        ...item,
        current: currentPath === item.href,
    }))

    return (
        <SidebarProvider>
            <div className="flex h-screen bg-background">
                {/* Sidebar */}
                <Sidebar className="border-r border-border/50">
                    <SidebarHeader className="border-b border-border/50 p-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Brain className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">SalesAI</h2>
                                <p className="text-xs text-muted-foreground">AI-Powered CRM</p>
                            </div>
                        </div>
                    </SidebarHeader>

                    <SidebarContent className="p-4">
                        <SidebarMenu>
                            {updatedNavigation.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    {item.permission ? (
                                        <RoleGuard permission={item.permission}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={item.current}
                                                className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
                                            >
                                                <a href={item.href}>
                                                    <item.icon className="w-4 h-4" />
                                                    {item.name}
                                                </a>
                                            </SidebarMenuButton>
                                        </RoleGuard>
                                    ) : (
                                        <SidebarMenuButton
                                            asChild
                                            isActive={item.current}
                                            className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <a href={item.href}>
                                                <item.icon className="w-4 h-4" />
                                                {item.name}
                                            </a>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarContent>

                    <SidebarFooter className="border-t border-border/50 p-4">
                        {currentUser && (
                            <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={currentUser.imageUrl || clerkUser?.imageUrl} />
                                    <AvatarFallback>
                                        {currentUser.firstName.charAt(0)}
                                        {currentUser.lastName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {currentUser.firstName} {currentUser.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                                </div>
                            </div>
                        )}
                    </SidebarFooter>
                </Sidebar>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Navigation */}
                    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm w-full">
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-4">
                                <SidebarTrigger />
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search contacts, deals, companies..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 w-80 bg-background/50"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="relative">
                                    <Bell className="w-4 h-4" />
                                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-destructive">3</Badge>
                                </Button>

                                {currentUser && (
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={currentUser.imageUrl || clerkUser?.imageUrl} />
                                            <AvatarFallback>
                                                {currentUser.firstName?.charAt(0)}
                                                {currentUser.lastName?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="text-sm">
                                            <p className="font-medium">
                                                {currentUser.firstName} {currentUser.lastName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{currentUser.role}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-auto p-6">{children}</main>
                </div>
            </div>
        </SidebarProvider>
    )
}
