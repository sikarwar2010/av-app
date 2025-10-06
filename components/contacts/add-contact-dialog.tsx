"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Plus, Loader2 } from "lucide-react"
import { toast } from 'sonner'

export function AddContactDialog() {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const createContactMutation = useMutation(api.contacts.createContact)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)

        try {
            await createContactMutation({
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                email: formData.get("email") as string,
                phone: (formData.get("phone") as string) || undefined,
                company: (formData.get("company") as string) || undefined,
                title: (formData.get("title") as string) || undefined,
                leadSource: (formData.get("leadSource") as string) || undefined,
                owner: "current-user", // TODO: Get from auth context
            })

            toast("Contact created successfully!")

            setOpen(false)
            e.currentTarget.reset()
        } catch (error) {
            toast("Failed to create contact. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                    <DialogDescription>Create a new contact in your CRM</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input id="firstName" name="firstName" placeholder="John" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input id="lastName" name="lastName" placeholder="Smith" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input id="email" name="email" type="email" placeholder="john@company.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" placeholder="+1 (555) 123-4567" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input id="company" name="company" placeholder="ACME Corp" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title</Label>
                            <Input id="title" name="title" placeholder="VP of Sales" />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="leadSource">Lead Source</Label>
                            <Select name="leadSource">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="website">Website</SelectItem>
                                    <SelectItem value="referral">Referral</SelectItem>
                                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                                    <SelectItem value="cold-email">Cold Email</SelectItem>
                                    <SelectItem value="event">Event</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Create Contact
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
