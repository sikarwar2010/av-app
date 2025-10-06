"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"
import { Mail, Phone, Building2, Calendar, Brain } from "lucide-react"

type Contact = {
    _id: Id<"contacts">
    firstName: string
    lastName: string
    email: string
    phone?: string
    company?: string
    title?: string
    owner: string
    lastActivity?: number
    sentiment?: "positive" | "neutral" | "negative"
    aiScore?: number
    leadSource?: string
    status: string
    rating: string
    createdAt: number
    updatedAt: number
}

interface ContactDetailSheetProps {
    contact: Contact
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ContactDetailSheet({ contact, open, onOpenChange }: ContactDetailSheetProps) {
    const contactDetails = useQuery(api.contacts.getContact, { id: contact._id })
    const fullName = `${contact.firstName} ${contact.lastName}`

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[600px] sm:max-w-[600px]">
                <SheetHeader>
                    <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={`/placeholder-icon.png?height=48&width=48&text=${contact.firstName.charAt(0)}`} />
                            <AvatarFallback>{contact.firstName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <SheetTitle className="text-xl">{fullName}</SheetTitle>
                            <SheetDescription>
                                {contact.title} {contact.company && `at ${contact.company}`}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                    {/* Contact Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{contact.email}</span>
                            </div>
                            {contact.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">{contact.phone}</span>
                                </div>
                            )}
                            {contact.company && (
                                <div className="flex items-center gap-3">
                                    <Building2 className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">{contact.company}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* AI Relationship Summary */}
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Brain className="w-5 h-5 text-primary" />
                                AI Relationship Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                {fullName} has been highly engaged over the past month with recent interactions. AI analysis shows{" "}
                                {contact.sentiment || "neutral"} sentiment and suggests continued engagement.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Brain className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium">AI Score: {contact.aiScore || 0}</span>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={`${contact.sentiment === "positive"
                                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                                            : contact.sentiment === "negative"
                                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                        }`}
                                >
                                    {contact.sentiment || "neutral"} sentiment
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {contactDetails?.activities?.length ? (
                                contactDetails.activities.slice(0, 3).map((activity, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 border border-border/50 rounded-lg">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            {activity.type === "call" && <Phone className="w-4 h-4 text-primary" />}
                                            {activity.type === "email" && <Mail className="w-4 h-4 text-primary" />}
                                            {activity.type === "meeting" && <Calendar className="w-4 h-4 text-primary" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-sm">{activity.subject}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(activity.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {activity.description && <p className="text-xs text-muted-foreground">{activity.description}</p>}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No recent activities</p>
                            )}
                            <Button variant="outline" className="w-full bg-transparent">
                                View Full Timeline
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Notes Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea placeholder="Add notes about this contact..." className="min-h-[100px]" />
                            <Button className="mt-3">Save Notes</Button>
                        </CardContent>
                    </Card>
                </div>
            </SheetContent>
        </Sheet>
    )
}
