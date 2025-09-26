"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, Crown, Shield, Users, Eye, Briefcase, AlertTriangle } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
import { toast } from 'sonner'

const roles = [
    {
        value: "owner",
        label: "Owner",
        description: "Full access to everything including billing and user management",
        icon: Crown,
        color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
    {
        value: "admin",
        label: "Admin",
        description: "Full access to manage team, settings, and all CRM features",
        icon: Shield,
        color: "bg-red-500/10 text-red-500 border-red-500/20",
    },
    {
        value: "manager",
        label: "Sales Manager",
        description: "Manage deals, reports, and team performance",
        icon: Briefcase,
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    {
        value: "sales",
        label: "Sales Rep",
        description: "Access to contacts, deals, and tasks",
        icon: Users,
        color: "bg-green-500/10 text-green-500 border-green-500/20",
    },
    {
        value: "viewer",
        label: "Viewer",
        description: "Read-only access to reports and data",
        icon: Eye,
        color: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    },
]

interface EditUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: Doc<"users"> | null
}

export function EditUserDialog({ open, onOpenChange, user }: EditUserDialogProps) {
    const { user: currentUser } = useUser()
    const [selectedRole, setSelectedRole] = useState(user?.role || "sales")
    const [isUpdating, setIsUpdating] = useState(false)

    const updateUserRole = useMutation(api.users.updateUserRole)

    useEffect(() => {
        if (user) {
            setSelectedRole(user.role)
        }
    }, [user])

    const handleUpdateRole = async () => {
        if (!currentUser || !user || selectedRole === user.role) return

        setIsUpdating(true)
        try {
            await updateUserRole({
                clerkId: currentUser.id,
                targetUserId: user._id,
                newRole: selectedRole,
            })

            toast("User role updated successfully.")

            onOpenChange(false)
        } catch (error) {
            toast("Failed to update user role.")
        } finally {
            setIsUpdating(false)
        }
    }

    if (!user) return null

    const currentRole = roles.find((r) => r.value === user.role)
    const newRole = roles.find((r) => r.value === selectedRole)
    const hasChanges = selectedRole !== user.role

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        Edit User Role
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Change the role and permissions for this team member.
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
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={currentRole?.color}>
                                    Current: {currentRole?.label}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-3">
                        <Label className="text-white">New Role</Label>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="bg-gray-700 border-gray-600">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => {
                                    const Icon = role.icon
                                    return (
                                        <SelectItem key={role.value} value={role.value}>
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4" />
                                                <div>
                                                    <div className="font-medium">{role.label}</div>
                                                    <div className="text-xs text-gray-400">{role.description}</div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>

                        {/* Role Change Preview */}
                        {hasChanges && newRole && (
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                                    <h4 className="text-yellow-400 font-medium">Role Change Preview</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300">Current Role:</span>
                                        <Badge variant="outline" className={currentRole?.color}>
                                            {currentRole?.label}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300">New Role:</span>
                                        <Badge variant="outline" className={newRole.color}>
                                            {newRole.label}
                                        </Badge>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    This change will take effect immediately and update the user&apos;s permissions.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdateRole}
                        disabled={isUpdating || !hasChanges}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {isUpdating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Edit className="h-4 w-4 mr-2" />
                                Update Role
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
