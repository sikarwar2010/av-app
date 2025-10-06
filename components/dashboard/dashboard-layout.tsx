"use client";

import type React from "react"
import { useState, useEffect } from "react"
import { UserButton } from "@clerk/nextjs"
import { useUserSync } from "@/hooks/use-user-sync"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
    Menu,
    X,
    type LucideIcon,
} from "lucide-react"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

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
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const { user: currentUser } = useUserSync()
    const pathname = usePathname()

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024)
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false)
            }
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const updatedNavigation = navigation.map((item) => ({
        ...item,
        current: pathname === item.href,
    }))

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Full-width Enterprise Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
                <div className="flex h-16 items-center justify-between px-4 lg:px-6">
                    {/* Left side - Logo and Menu */}
                    <div className="flex items-center gap-4">
                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>

                        {/* Logo */}
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold text-gray-900">AV Valve Ltd</h1>
                                <p className="text-xs text-gray-500 leading-none">Enterprise CRM</p>
                            </div>
                        </Link>
                    </div>

                    {/* Center - Search (hidden on mobile) */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search contacts, deals, companies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 w-full bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Right side - Actions and User */}
                    <div className="flex items-center gap-2 lg:gap-4">
                        {/* Mobile search button */}
                        <Button variant="ghost" size="sm" className="md:hidden">
                            <Search className="h-4 w-4" />
                        </Button>

                        {/* Notifications */}
                        <Button variant="ghost" size="sm" className="relative">
                            <Bell className="h-4 w-4" />
                            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-red-500 text-white border-white">3</Badge>
                        </Button>

                        {/* User Profile */}
                        <div className="flex items-center gap-3">
                            {currentUser && (
                                <div className="hidden lg:block text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                        {currentUser.firstName} {currentUser.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                                </div>
                            )}
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-8 h-8"
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar Overlay for Mobile */}
                {isMobile && sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={cn(
                    "fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out",
                    "lg:static lg:translate-x-0",
                    isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
                )}>
                    {/* Navigation */}
                    <nav className="h-full overflow-y-auto px-3 py-4">
                        <div className="space-y-1">
                            {updatedNavigation.map((item) => {
                                const ItemComponent = item.permission ? (
                                    <RoleGuard key={item.name} permission={item.permission}>
                                        <Link
                                            href={item.href}
                                            onClick={() => isMobile && setSidebarOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                                item.current
                                                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "h-4 w-4 flex-shrink-0",
                                                item.current ? "text-blue-600" : "text-gray-400"
                                            )} />
                                            {item.name}
                                        </Link>
                                    </RoleGuard>
                                ) : (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => isMobile && setSidebarOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                            item.current
                                                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "h-4 w-4 flex-shrink-0",
                                            item.current ? "text-blue-600" : "text-gray-400"
                                        )} />
                                        {item.name}
                                    </Link>
                                )
                                return ItemComponent
                            })}
                        </div>

                        {/* Sidebar Footer */}
                        <div className="absolute bottom-4 left-3 right-3">
                            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-3 border border-blue-200">
                                <div className="flex items-center gap-2 text-xs text-blue-600">
                                    <Brain className="h-4 w-4" />
                                    <span className="font-medium">AI Assistant Ready</span>
                                </div>
                                <p className="text-xs text-blue-500 mt-1">Get insights on your sales data</p>
                            </div>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className={cn(
                    "flex-1 min-h-[calc(100vh-4rem)]",
                    "lg:ml-8" // Desktop: account for fixed sidebar
                )}>
                    <div className="h-full bg-white">
                        {/* Content Container */}
                        <div className="h-full p-4 lg:p-6 xl:p-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
