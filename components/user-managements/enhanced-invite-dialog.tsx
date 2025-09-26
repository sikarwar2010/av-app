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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Shield, Users, Eye, Briefcase, Check, AlertCircle, Settings, BarChart3, Database } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from 'sonner'
import { CheckedState } from '@radix-ui/react-checkbox'

// Type definitions for invitation data
interface InvitationEmailData {
    email: string
    role: string
    token: string
}

interface APIResponse {
    success: boolean
    error?: string
}

// Enhanced permission structure with granular controls
const PERMISSION_MODULES = {
    contacts: {
        label: "Contacts",
        icon: Users,
        permissions: [
            { key: "view", label: "View Contacts", description: "See contact information" },
            { key: "create", label: "Create Contacts", description: "Add new contacts" },
            { key: "edit", label: "Edit Contacts", description: "Modify contact details" },
            { key: "delete", label: "Delete Contacts", description: "Remove contacts" },
            { key: "export", label: "Export Contacts", description: "Download contact data" },
        ],
    },
    deals: {
        label: "Deals",
        icon: Briefcase,
        permissions: [
            { key: "view", label: "View Deals", description: "See deal information" },
            { key: "create", label: "Create Deals", description: "Add new deals" },
            { key: "edit", label: "Edit Deals", description: "Modify deal details" },
            { key: "delete", label: "Delete Deals", description: "Remove deals" },
            { key: "manage_pipeline", label: "Manage Pipeline", description: "Change deal stages" },
        ],
    },
    reports: {
        label: "Reports",
        icon: BarChart3,
        permissions: [
            { key: "view", label: "View Reports", description: "Access reports and analytics" },
            { key: "create", label: "Create Reports", description: "Generate custom reports" },
            { key: "export", label: "Export Reports", description: "Download report data" },
            { key: "schedule", label: "Schedule Reports", description: "Set up automated reports" },
        ],
    },
    settings: {
        label: "Settings",
        icon: Settings,
        permissions: [
            { key: "view", label: "View Settings", description: "Access system settings" },
            { key: "company", label: "Company Settings", description: "Modify company information" },
            { key: "users", label: "User Management", description: "Manage team members" },
            { key: "integrations", label: "Integrations", description: "Configure third-party tools" },
        ],
    },
    data: {
        label: "Data Management",
        icon: Database,
        permissions: [
            { key: "import", label: "Import Data", description: "Upload data from files" },
            { key: "export", label: "Export Data", description: "Download system data" },
            { key: "backup", label: "Backup Access", description: "Access data backups" },
            { key: "audit", label: "Audit Logs", description: "View system activity logs" },
        ],
    },
}

// Predefined role templates with permissions
const ROLE_TEMPLATES = {
    admin: {
        label: "Administrator",
        description: "Full system access with all permissions",
        icon: Shield,
        color: "bg-red-500/10 text-red-400 border-red-500/20",
        permissions: Object.keys(PERMISSION_MODULES).reduce(
            (acc, module) => {
                acc[module] = PERMISSION_MODULES[module as keyof typeof PERMISSION_MODULES].permissions.map((p) => p.key)
                return acc
            },
            {} as Record<string, string[]>,
        ),
    },
    manager: {
        label: "Sales Manager",
        description: "Manage team performance and access all data",
        icon: Briefcase,
        color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        permissions: {
            contacts: ["view", "create", "edit", "export"],
            deals: ["view", "create", "edit", "manage_pipeline"],
            reports: ["view", "create", "export", "schedule"],
            settings: ["view"],
            data: ["export"],
        },
    },
    sales: {
        label: "Sales Representative",
        description: "Manage own contacts and deals",
        icon: Users,
        color: "bg-green-500/10 text-green-400 border-green-500/20",
        permissions: {
            contacts: ["view", "create", "edit"],
            deals: ["view", "create", "edit"],
            reports: ["view"],
            settings: [],
            data: [],
        },
    },
    viewer: {
        label: "Viewer",
        description: "Read-only access to data and reports",
        icon: Eye,
        color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
        permissions: {
            contacts: ["view"],
            deals: ["view"],
            reports: ["view"],
            settings: [],
            data: [],
        },
    },
}

interface EnhancedInviteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EnhancedInviteDialog({ open, onOpenChange }: EnhancedInviteDialogProps) {
    const [email, setEmail] = useState("")
    const [selectedRole, setSelectedRole] = useState<keyof typeof ROLE_TEMPLATES>("sales")
    const [customPermissions, setCustomPermissions] = useState<Record<string, string[]>>({})
    const [message, setMessage] = useState("")
    const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true)
    const [isInviting, setIsInviting] = useState(false)
    const [useCustomPermissions, setUseCustomPermissions] = useState(false)

    const inviteTeamMember = useMutation(api.settings.inviteTeamMember)

    // Initialize custom permissions when role changes
    const handleRoleChange = (role: keyof typeof ROLE_TEMPLATES) => {
        setSelectedRole(role)
        setCustomPermissions(ROLE_TEMPLATES[role].permissions)
        setUseCustomPermissions(false)
    }

    // Toggle individual permission
    const togglePermission = (module: string, permission: string) => {
        setCustomPermissions((prev) => {
            const modulePerms = prev[module] || []
            const hasPermission = modulePerms.includes(permission)

            return {
                ...prev,
                [module]: hasPermission ? modulePerms.filter((p) => p !== permission) : [...modulePerms, permission],
            }
        })
    }

    // Send invitation with email
    const sendInvitationEmail = async (invitationData: InvitationEmailData): Promise<APIResponse> => {
        try {
            const response = await fetch("/api/send-invitation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: invitationData.email,
                    role: invitationData.role,
                    inviterName: "Current User", // In real app, get from auth
                    companyName: "Your Company", // In real app, get from settings
                    inviteLink: `${window.location.origin}/accept-invitation?token=${invitationData.token}`,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                }),
            })

            const result: APIResponse = await response.json()
            if (!result.success) {
                throw new Error(result.error)
            }

            return result
        } catch (error) {
            console.error("[v0] Failed to send invitation email:", error)
            throw error
        }
    }

    const handleInvite = async () => {
        if (!email) return

        setIsInviting(true)
        try {
            // Create invitation in database
            const invitationId = await inviteTeamMember({
                email,
                role: selectedRole,
                invitedBy: "current-user-id", // In real app, get from auth
            })

            // Send email if enabled
            if (sendWelcomeEmail) {
                try {
                    await sendInvitationEmail({
                        email,
                        role: selectedRole,
                        token: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    })
                } catch (emailError) {
                    console.error("[v0] Email sending failed, but invitation was created:", emailError)
                    toast("Invitation created, but email sending failed.")
                }
            }

            toast("Invitation sent successfully.")

            // Reset form
            setEmail("")
            setSelectedRole("sales")
            setCustomPermissions({})
            setMessage("")
            setSendWelcomeEmail(true)
            setUseCustomPermissions(false)
            onOpenChange(false)
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to send invitation."
            toast(errorMessage)
        } finally {
            setIsInviting(false)
        }
    }

    const currentPermissions: Record<string, string[]> = useCustomPermissions ? customPermissions : ROLE_TEMPLATES[selectedRole].permissions
    const totalPermissions = Object.values(currentPermissions).flat().length

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Invite Team Member
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Send an invitation with specific role and granular permissions to join your CRM workspace.
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
                        <Label className="text-white">Role Template</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(ROLE_TEMPLATES).map(([key, role]) => {
                                const Icon = role.icon
                                const isSelected = selectedRole === key
                                return (
                                    <div
                                        key={key}
                                        onClick={() => handleRoleChange(key as keyof typeof ROLE_TEMPLATES)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all ${isSelected
                                            ? "border-purple-500 bg-purple-500/10"
                                            : "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? "text-purple-400" : "text-gray-400"}`} />
                                            <div className="flex-1">
                                                <h4 className={`font-medium ${isSelected ? "text-purple-300" : "text-white"}`}>{role.label}</h4>
                                                <p className="text-sm text-gray-400 mt-1">{role.description}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge variant="outline" className={role.color}>
                                                        {Object.values(role.permissions).flat().length} permissions
                                                    </Badge>
                                                </div>
                                            </div>
                                            {isSelected && <Check className="h-4 w-4 text-purple-400" />}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Custom Permissions Toggle */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="custom-permissions"
                            checked={useCustomPermissions}
                            onCheckedChange={(checked: CheckedState) => setUseCustomPermissions(checked === true)}
                        />
                        <Label htmlFor="custom-permissions" className="text-white text-sm">
                            Customize permissions for this user
                        </Label>
                    </div>

                    {/* Permission Details */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-white font-medium">
                                {useCustomPermissions ? "Custom Permissions" : `${ROLE_TEMPLATES[selectedRole].label} Permissions`}
                            </h4>
                            <Badge variant="outline" className="text-purple-400 border-purple-500/20">
                                {totalPermissions} permissions granted
                            </Badge>
                        </div>

                        <div className="grid gap-4">
                            {Object.entries(PERMISSION_MODULES).map(([moduleKey, module]) => {
                                const Icon = module.icon
                                const modulePermissions = currentPermissions[moduleKey as keyof typeof currentPermissions] || []
                                const hasAnyPermission = modulePermissions.length > 0

                                return (
                                    <div key={moduleKey} className="bg-gray-700/30 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Icon className={`h-5 w-5 ${hasAnyPermission ? "text-green-400" : "text-gray-500"}`} />
                                            <h5 className="text-white font-medium">{module.label}</h5>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    hasAnyPermission ? "text-green-400 border-green-500/20" : "text-gray-500 border-gray-600"
                                                }
                                            >
                                                {modulePermissions.length}/{module.permissions.length}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {module.permissions.map((permission) => {
                                                const hasPermission = modulePermissions.includes(permission.key)
                                                return (
                                                    <div key={permission.key} className="flex items-start space-x-2">
                                                        <Checkbox
                                                            id={`${moduleKey}-${permission.key}`}
                                                            checked={hasPermission}
                                                            onCheckedChange={() =>
                                                                useCustomPermissions && togglePermission(moduleKey, permission.key)
                                                            }
                                                            disabled={!useCustomPermissions}
                                                            className="mt-0.5"
                                                        />
                                                        <div className="flex-1">
                                                            <Label
                                                                htmlFor={`${moduleKey}-${permission.key}`}
                                                                className={`text-sm ${hasPermission ? "text-white" : "text-gray-400"} ${useCustomPermissions ? "cursor-pointer" : "cursor-default"}`}
                                                            >
                                                                {permission.label}
                                                            </Label>
                                                            <p className="text-xs text-gray-500">{permission.description}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <Separator className="bg-gray-600" />

                    {/* Personal Message */}
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-white">
                            Personal Welcome Message (Optional)
                        </Label>
                        <Textarea
                            id="message"
                            placeholder="Add a personal welcome message to include in the invitation email..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                            rows={3}
                        />
                    </div>

                    {/* Email Options */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="welcome-email" checked={sendWelcomeEmail} onCheckedChange={(checked: CheckedState) => setSendWelcomeEmail(checked === true)} />
                            <Label htmlFor="welcome-email" className="text-white text-sm">
                                Send welcome email with setup instructions
                            </Label>
                        </div>

                        {sendWelcomeEmail && (
                            <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="text-blue-300 font-medium">Email will include:</p>
                                    <ul className="text-blue-200 mt-1 space-y-1">
                                        <li>• Secure invitation link (expires in 7 days)</li>
                                        <li>• Role and permission details</li>
                                        <li>• Setup instructions for first login</li>
                                        {message && <li>• Your personal welcome message</li>}
                                    </ul>
                                </div>
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
                    <Button onClick={handleInvite} disabled={isInviting || !email} className="bg-purple-600 hover:bg-purple-700">
                        {isInviting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Sending Invitation...
                            </>
                        ) : (
                            <>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Invitation ({totalPermissions} permissions)
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
