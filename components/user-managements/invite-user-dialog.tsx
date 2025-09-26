"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Shield, Users, Eye, Briefcase } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from 'sonner'

const roles = [
    {
        value: "admin",
        label: "Admin",
        description: "Full access to manage team, settings, and all CRM features",
        icon: Shield,
        permissions: ["Manage Users", "All Data Access", "Settings Management", "Export Data"],
    },
    {
        value: "manager",
        label: "Sales Manager",
        description: "Manage deals, reports, and team performance",
        icon: Briefcase,
        permissions: ["View All Data", "Edit Data", "Generate Reports", "Export Data"],
    },
    {
        value: "sales",
        label: "Sales Rep",
        description: "Access to contacts, deals, and tasks",
        icon: Users,
        permissions: ["Manage Own Data", "Create Records", "View Reports"],
    },
    {
        value: "viewer",
        label: "Viewer",
        description: "Read-only access to reports and data",
        icon: Eye,
        permissions: ["View Data", "View Reports"],
    },
]

interface InviteUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function InviteUserDialog({ open, onOpenChange }: InviteUserDialogProps) {
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("sales")
    const [message, setMessage] = useState("")
    const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true)
    const [isInviting, setIsInviting] = useState(false)

    const inviteTeamMember = useMutation(api.settings.inviteTeamMember)

    const handleInvite = async () => {
        if (!email) return

        setIsInviting(true)
        try {
            await inviteTeamMember({
                email,
                role,
                invitedBy: "current-user-id", // In real app, get from auth
            })

            toast("Team member invited successfully.")

            // Reset form
            setEmail("")
            setRole("owner")
            setMessage("")
            setSendWelcomeEmail(true)
            onOpenChange(false)
        } catch (error) {
            toast("Failed to invite team member.")
        } finally {
            setIsInviting(false)
        }
    }

    const selectedRole = roles.find((r) => r.value === role)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Invite Team Member
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Send an invitation to join your CRM workspace with specific role and permissions.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                            Email Address *
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="colleague@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                        />
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-3">
                        <Label className="text-white">Role & Permissions *</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="bg-gray-700 border-gray-600">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((roleOption) => {
                                    const Icon = roleOption.icon
                                    return (
                                        <SelectItem key={roleOption.value} value={roleOption.value}>
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4" />
                                                <div>
                                                    <div className="font-medium">{roleOption.label}</div>
                                                    <div className="text-xs text-gray-400">{roleOption.description}</div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>

                        {/* Role Permissions Preview */}
                        {selectedRole && (
                            <div className="p-4 bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <selectedRole.icon className="h-4 w-4 text-blue-400" />
                                    <h4 className="text-white font-medium">{selectedRole.label} Permissions</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {selectedRole.permissions.map((permission) => (
                                        <div key={permission} className="flex items-center gap-2 text-sm text-gray-300">
                                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                            {permission}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Personal Message */}
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-white">
                            Personal Message (Optional)
                        </Label>
                        <Textarea
                            id="message"
                            placeholder="Add a personal welcome message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                            rows={3}
                        />
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="welcome-email"
                                checked={sendWelcomeEmail}
                                onCheckedChange={(checked) => setSendWelcomeEmail(checked === true)}
                            />
                            <Label htmlFor="welcome-email" className="text-white text-sm">
                                Send welcome email with setup instructions
                            </Label>
                        </div>
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
                    <Button onClick={handleInvite} disabled={isInviting || !email} className="bg-purple-600 hover:bg-purple-700">
                        {isInviting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Sending Invitation...
                            </>
                        ) : (
                            <>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Invitation
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
