"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Mail, MoreHorizontal, Trash2, Clock, Send } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from 'sonner'
import { Doc, Id } from "@/convex/_generated/dataModel"

const roleColors = {
    admin: "bg-red-500/10 text-red-500 border-red-500/20",
    manager: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    sales: "bg-green-500/10 text-green-500 border-green-500/20",
    viewer: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

interface PendingInvitationsProps {
    invitations: Doc<"invitations">[]
}

export function PendingInvitations({ invitations }: PendingInvitationsProps) {
    const [isResending, setIsResending] = useState<string | null>(null)

    const resendInvitation = useMutation(api.settings.resendInvitation)
    const cancelInvitation = useMutation(api.settings.cancelInvitation)

    const handleResendInvitation = async (invitationId: string, email: string) => {
        setIsResending(invitationId)
        try {
            await resendInvitation({ invitationId: invitationId as Id<"invitations"> })
            toast.success("Invitation Resent", {
                description: `Invitation resent to ${email}`,
            })
        } catch (error) {
            toast.error("Error", {
                description: "Failed to resend invitation.",
            })
        } finally {
            setIsResending(null)
        }
    }

    const handleCancelInvitation = async (invitationId: string, email: string) => {
        try {
            await cancelInvitation({ invitationId: invitationId as Id<"invitations"> })
            toast.success("Invitation cancelled.")
        } catch (error) {
            toast.error("Failed to cancel invitation.")
        }
    }

    const getTimeAgo = (timestamp: number) => {
        const now = Date.now()
        const diff = now - timestamp
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor(diff / (1000 * 60))

        if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
        if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
        return "Just now"
    }

    const getExpiryStatus = (expiresAt: number) => {
        const now = Date.now()
        const timeLeft = expiresAt - now
        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24))

        if (timeLeft <= 0)
            return { status: "expired", text: "Expired", color: "bg-red-500/10 text-red-500 border-red-500/20" }
        if (daysLeft <= 1)
            return {
                status: "expiring",
                text: "Expires soon",
                color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
            }
        return {
            status: "active",
            text: `${daysLeft} days left`,
            color: "bg-green-500/10 text-green-500 border-green-500/20",
        }
    }

    if (!invitations || invitations.length === 0) {
        return (
            <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-12">
                    <div className="text-center">
                        <Mail className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-white font-medium mb-2">No Pending Invitations</h3>
                        <p className="text-gray-400 text-sm">
                            All team invitations have been accepted or there are no pending invites.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Invitations ({invitations.length})
                </CardTitle>
                <p className="text-gray-400 text-sm">Team members who have been invited but haven&apos;t joined yet</p>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border border-gray-700">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-700">
                                <TableHead className="text-gray-300">Email</TableHead>
                                <TableHead className="text-gray-300">Role</TableHead>
                                <TableHead className="text-gray-300">Invited</TableHead>
                                <TableHead className="text-gray-300">Status</TableHead>
                                <TableHead className="text-gray-300">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invitations.map((invitation) => {
                                const expiryInfo = getExpiryStatus(invitation.expiresAt)

                                return (
                                    <TableRow key={invitation._id} className="border-gray-700">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="bg-gray-600 text-gray-300">
                                                        {invitation.email.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-white">{invitation.email}</p>
                                                    <p className="text-sm text-gray-400">Invited {getTimeAgo(invitation.createdAt)}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={roleColors[invitation.role as keyof typeof roleColors]}>
                                                {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-400">
                                            {new Date(invitation.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={expiryInfo.color}>
                                                {expiryInfo.text}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => handleResendInvitation(invitation._id, invitation.email)}
                                                        disabled={isResending === invitation._id || expiryInfo.status === "expired"}
                                                    >
                                                        {isResending === invitation._id ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                                                                Resending...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Send className="mr-2 h-4 w-4" />
                                                                Resend Invitation
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Cancel Invitation
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="bg-gray-800 border-gray-700">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="text-white">Cancel Invitation</AlertDialogTitle>
                                                                <AlertDialogDescription className="text-gray-400">
                                                                    Are you sure you want to cancel the invitation to {invitation.email}? This action
                                                                    cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                                                                    Keep Invitation
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                    onClick={() => handleCancelInvitation(invitation._id, invitation.email)}
                                                                >
                                                                    Cancel Invitation
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
