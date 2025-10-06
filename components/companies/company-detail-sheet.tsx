"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, Globe, Phone, Users, Target, Brain, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface CompanyDetailSheetProps {
    companyId: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CompanyDetailSheet({ companyId, open, onOpenChange }: CompanyDetailSheetProps) {
    const company = useQuery(api.companies.getCompany, {
        id: companyId as Id<"companies">,
    })

    const deleteCompany = useMutation(api.companies.deleteCompany)
    const updateHealthScore = useMutation(api.companies.updateHealthScore)

    const handleDeleteCompany = async () => {
        if (!company) return

        try {
            await deleteCompany({ id: company._id })
            toast.success("Company deleted successfully")
            onOpenChange(false)
        } catch (error) {
            toast.error("Failed to delete company")
            console.error("Delete company error:", error)
        }
    }

    const handleUpdateHealthScore = async () => {
        if (!company) return

        try {
            await updateHealthScore({
                id: company._id,
                dealActivity: 1,
                communicationFrequency: 1,
                paymentHistory: "good",
            })
            toast.success("Health score updated")
        } catch (error) {
            toast.error("Failed to update health score")
            console.error("Update health score error:", error)
        }
    }

    if (!company) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-[600px] sm:max-w-[600px]">
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[600px] sm:max-w-[600px]">
                <SheetHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <SheetTitle className="text-xl">{company.name}</SheetTitle>
                                <SheetDescription>{company.industry || "No industry specified"}</SheetDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDeleteCompany}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                    {/* Company Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Company Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {company.website && (
                                <div className="flex items-center gap-3">
                                    <Globe className="w-4 h-4 text-muted-foreground" />
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {company.website.replace("https://", "").replace("http://", "")}
                                    </a>
                                </div>
                            )}
                            {company.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">{company.phone}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{company.metrics?.contactCount || 0} contacts</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Target className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{company.metrics?.activeDeals || 0} active deals</span>
                            </div>
                            <div className="text-sm text-muted-foreground">Owner: {company.owner}</div>
                            <div className="text-sm text-muted-foreground">Type: {company.type}</div>
                        </CardContent>
                    </Card>

                    {/* AI Health Score */}
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Brain className="w-5 h-5 text-primary" />
                                AI Health Score & Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Account Health</span>
                                    <span
                                        className={`text-sm font-bold ${(company.healthScore || 50) >= 80
                                                ? "text-green-500"
                                                : (company.healthScore || 50) >= 60
                                                    ? "text-yellow-500"
                                                    : "text-red-500"
                                            }`}
                                    >
                                        {company.healthScore || 50}/100
                                    </span>
                                </div>
                                <Progress value={company.healthScore || 50} className="h-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="font-medium">Total Revenue</div>
                                    <div className="text-muted-foreground">
                                        ${((company.metrics?.totalRevenue || 0) / 1000).toFixed(0)}K
                                    </div>
                                </div>
                                <div>
                                    <div className="font-medium">Pipeline Value</div>
                                    <div className="text-muted-foreground">
                                        ${((company.metrics?.pipelineValue || 0) / 1000).toFixed(0)}K
                                    </div>
                                </div>
                                <div>
                                    <div className="font-medium">Won Deals</div>
                                    <div className="text-muted-foreground">{company.metrics?.wonDeals || 0}</div>
                                </div>
                                <div>
                                    <div className="font-medium">Active Deals</div>
                                    <div className="text-muted-foreground">{company.metrics?.activeDeals || 0}</div>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                {(company.healthScore || 50) >= 80
                                    ? "Strong relationship with high engagement. Excellent prospects."
                                    : (company.healthScore || 50) >= 60
                                        ? "Moderate engagement. Consider increasing touchpoints to improve health score."
                                        : "Low engagement detected. Immediate attention required to prevent churn."}
                            </p>

                            <Button variant="outline" size="sm" onClick={handleUpdateHealthScore} className="w-full bg-transparent">
                                Refresh Health Score
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recent Deals */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Deals</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {company.deals && company.deals.length > 0 ? (
                                company.deals.slice(0, 3).map((deal) => (
                                    <div
                                        key={deal._id}
                                        className="flex items-center justify-between p-3 border border-border/50 rounded-lg"
                                    >
                                        <div>
                                            <div className="font-medium text-sm">{deal.title}</div>
                                            <div className="text-xs text-muted-foreground">{deal.stage}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-sm">${(deal.amount / 1000).toFixed(0)}K</div>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(deal.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-muted-foreground text-sm">No deals found for this company</div>
                            )}
                            <Button variant="outline" className="w-full bg-transparent">
                                View All Deals
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Activities</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {company.activities && company.activities.length > 0 ? (
                                company.activities.slice(0, 5).map((activity) => (
                                    <div key={activity._id} className="flex items-start gap-3 p-3 border border-border/50 rounded-lg">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{activity.subject}</div>
                                            <div className="text-xs text-muted-foreground">{activity.description}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {new Date(activity.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-muted-foreground text-sm">No recent activities</div>
                            )}
                            <Button variant="outline" className="w-full bg-transparent">
                                View All Activities
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </SheetContent>
        </Sheet>
    )
}
