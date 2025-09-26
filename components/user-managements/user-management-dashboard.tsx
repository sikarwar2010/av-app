"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Users,
    UserPlus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Shield,
    Crown,
    CheckCircle,
    XCircle,
    Clock,
    Filter,
} from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { EditUserDialog } from "./edit-user-dialog"
import { RoleGuard } from "@/components/auth/role-guard"
import { toast } from 'sonner'
import type { Doc, Id } from "@/convex/_generated/dataModel"

const roleColors = {
    owner: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    admin: "bg-red-500/10 text-red-500 border-red-500/20",
    manager: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    sales: "bg-green-500/10 text-green-500 border-green-500/20",
    viewer: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

const statusColors = {
    active: "bg-green-500/10 text-green-500 border-green-500/20",
    inactive: "bg-red-500/10 text-red-500 border-red-500/20",
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
}

export function UserManagementDashboard() {
    const { user } = useUser()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedRole, setSelectedRole] = useState<string>("all")
    const [selectedUser, setSelectedUser] = useState<Doc<"users"> | null>(null)
    const [showEditDialog, setShowEditDialog] = useState(false)

    const users = useQuery(
        api.users.getUsers,
        user
            ? {
                clerkId: user.id,
                search: searchTerm || undefined,
                limit: 100,
            }
            : "skip",
    )

    // TODO: Implement getInvitations function in convex/users.ts
    // const invitations = useQuery(api.users.getInvitations, user ? { clerkId: user.id } : "skip")
    const invitations = []
    const deactivateUser = useMutation(api.users.deactivateUser)
    const updateUserRole = useMutation(api.users.updateUserRole)

    const handleDeactivateUser = async (userId: string) => {
        if (!user) return

        try {
            await deactivateUser({ clerkId: user.id, targetUserId: userId as Id<"users"> })
            toast("User deactivated successfully.")
        } catch (error) {
            toast("Failed to deactivate user.")
        }
    }

    const filteredUsers = users?.filter((u) => selectedRole === "all" || u.role === selectedRole) || []

    const activeUsers = users?.filter((u) => u.isActive).length || 0
    const inactiveUsers = users?.filter((u) => !u.isActive).length || 0
    const pendingInvites = invitations?.length || 0 // Will work when getInvitations is implemented

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400">Total Users</p>
                                <p className="text-2xl font-bold text-white">{users?.length || 0}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400">Active Users</p>
                                <p className="text-2xl font-bold text-green-400">{activeUsers}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400">Inactive Users</p>
                                <p className="text-2xl font-bold text-red-400">{inactiveUsers}</p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400">Pending Invites</p>
                                <p className="text-2xl font-bold text-yellow-400">{pendingInvites}</p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white">User Management</CardTitle>
                            <CardDescription className="text-gray-400">Manage team members, roles, and permissions</CardDescription>
                        </div>
                        <RoleGuard permission="canManageUsers">
                            <Button onClick={() => toast("Invite feature coming soon")} className="bg-purple-600 hover:bg-purple-700">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Invite User
                            </Button>
                        </RoleGuard>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="users" className="space-y-4">
                        <TabsList className="bg-gray-700">
                            <TabsTrigger value="users" className="data-[state=active]:bg-gray-600">
                                Active Users
                            </TabsTrigger>
                            <TabsTrigger value="invitations" className="data-[state=active]:bg-gray-600">
                                Pending Invitations
                            </TabsTrigger>
                            <TabsTrigger value="permissions" className="data-[state=active]:bg-gray-600">
                                Role Permissions
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="users" className="space-y-4">
                            {/* Filters */}
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-gray-700 border-gray-600 text-white"
                                    />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="border-gray-600 bg-transparent">
                                            <Filter className="h-4 w-4 mr-2" />
                                            {selectedRole === "all" ? "All Roles" : selectedRole}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => setSelectedRole("all")}>All Roles</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedRole("owner")}>Owner</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedRole("admin")}>Admin</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedRole("manager")}>Manager</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedRole("sales")}>Sales Rep</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedRole("viewer")}>Viewer</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Users Table */}
                            <div className="rounded-md border border-gray-700">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gray-700">
                                            <TableHead className="text-gray-300">User</TableHead>
                                            <TableHead className="text-gray-300">Role</TableHead>
                                            <TableHead className="text-gray-300">Status</TableHead>
                                            <TableHead className="text-gray-300">Last Active</TableHead>
                                            <TableHead className="text-gray-300">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user._id} className="border-gray-700">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={user.imageUrl || "/placeholder.svg"} />
                                                            <AvatarFallback>
                                                                {user.firstName.charAt(0)}
                                                                {user.lastName.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium text-white">
                                                                    {user.firstName} {user.lastName}
                                                                </p>
                                                                {user.role === "owner" && <Crown className="h-4 w-4 text-yellow-400" />}
                                                            </div>
                                                            <p className="text-sm text-gray-400">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={roleColors[user.role as keyof typeof roleColors]}>
                                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={statusColors[user.isActive ? "active" : "inactive"]}>
                                                        {user.isActive ? "Active" : "Inactive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-gray-400">{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <RoleGuard permission="canManageUsers">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        // TODO: Implement permissions dialog
                                                                        toast("Permissions view coming soon")
                                                                    }}
                                                                >
                                                                    <Shield className="mr-2 h-4 w-4" />
                                                                    View Permissions
                                                                </DropdownMenuItem>
                                                                {user.role !== "owner" && (
                                                                    <>
                                                                        <DropdownMenuItem
                                                                            onClick={() => {
                                                                                setSelectedUser(user)
                                                                                setShowEditDialog(true)
                                                                            }}
                                                                        >
                                                                            <Edit className="mr-2 h-4 w-4" />
                                                                            Edit Role
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleDeactivateUser(user._id)}
                                                                            className="text-red-600"
                                                                        >
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            Deactivate
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </RoleGuard>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="invitations">
                            {/* <PendingInvitations invitations={invitations} /> */}
                            <div className="text-center py-8 text-gray-400">Pending invitations will be displayed here</div>
                        </TabsContent>

                        <TabsContent value="permissions">
                            {/* <RolePermissionsMatrix /> */}
                            <div className="text-center py-8 text-gray-400">Role permissions matrix will be displayed here</div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Dialogs */}
            {selectedUser && (
                <>
                    <EditUserDialog open={showEditDialog} onOpenChange={setShowEditDialog} user={selectedUser} />
                </>
            )}
        </div>
    )
}
