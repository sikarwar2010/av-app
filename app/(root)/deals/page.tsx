"use client"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { DealsKanbanBoard } from "@/components/deals/deals-kanban-board"
import { AddDealDialog } from "@/components/deals/add-deal-dialog"
import { DealDetailSheet } from "@/components/deals/deal-detail-sheet"
import { DealsFilters } from "@/components/deals/deals-filters"
import type { Deal } from "@/lib/types"

// Type for the raw API response
interface ApiDeal {
    _id: Deal["_id"]
    name: string
    amount: number
    stage: string
    aiProbability?: number
    probability: number
    closeDate: number
    owner: string
    company: {
        _id: string
        _creationTime: number
        name: string
        industry?: string
        website?: string
        phone?: string
        employees?: number
        annualRevenue?: number
        type: string
        healthScore?: number
        owner: string
        createdAt: number
        updatedAt: number
    } | null
    contact: {
        _id: string
        _creationTime: number
        firstName: string
        lastName: string
        email: string
        phone?: string
        company?: string
        title?: string
        leadSource?: string
        status: string
        rating: string
        owner: string
        aiScore?: number
        sentiment?: "positive" | "neutral" | "negative"
        lastActivity?: number
        createdAt: number
        updatedAt: number
    } | null
}

// Transform function to convert API response to component format
function transformApiDeal(apiDeal: ApiDeal): Deal {
    return {
        _id: apiDeal._id,
        name: apiDeal.name,
        amount: apiDeal.amount,
        stage: apiDeal.stage,
        aiProbability: apiDeal.aiProbability,
        probability: apiDeal.probability,
        closeDate: apiDeal.closeDate,
        owner: apiDeal.owner,
        company: apiDeal.company ? { name: apiDeal.company.name } : undefined,
        contact: apiDeal.contact ? { name: `${apiDeal.contact.firstName} ${apiDeal.contact.lastName}` } : undefined,
    }
}

export default function DealsPage() {
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStage, setSelectedStage] = useState("")
    const [selectedOwner, setSelectedOwner] = useState("")

    const dealsByStage = useQuery(api.deals.getDealsByStage) || {}
    const dealsSummary = useQuery(api.deals.getDealsSummary)

    const filteredDealsByStage = Object.keys(dealsByStage).reduce(
        (acc, stage) => {
            let apiDeals = dealsByStage[stage] || [] // These are ApiDeals from the API

            // Apply search filter on API deals
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase()
                apiDeals = apiDeals.filter(
                    (apiDeal: ApiDeal) =>
                        apiDeal.name.toLowerCase().includes(searchLower) ||
                        apiDeal.company?.name.toLowerCase().includes(searchLower) ||
                        (apiDeal.contact ? `${apiDeal.contact.firstName} ${apiDeal.contact.lastName}`.toLowerCase().includes(searchLower) : false),
                )
            }

            // Apply stage filter
            if (selectedStage && stage !== selectedStage) {
                apiDeals = []
            }

            // Apply owner filter
            if (selectedOwner) {
                apiDeals = apiDeals.filter((apiDeal: ApiDeal) => apiDeal.owner === selectedOwner)
            }

            // Transform API deals to component deals
            acc[stage] = apiDeals.map(transformApiDeal)
            return acc
        },
        {} as Record<string, Deal[]>,
    )

    const getTotalValue = () => {
        return Object.values(filteredDealsByStage)
            .flat()
            .reduce((sum, deal) => sum + deal.amount, 0)
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Deals</h1>
                        <p className="text-muted-foreground">Manage your sales pipeline with AI-powered insights</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            <DollarSign className="w-3 h-3 mr-1" />${(getTotalValue() / 1000000).toFixed(1)}M Pipeline
                        </Badge>
                        <AddDealDialog />
                    </div>
                </div>

                {/* Search and Filters */}
                <DealsFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedStage={selectedStage}
                    onStageChange={setSelectedStage}
                    selectedOwner={selectedOwner}
                    onOwnerChange={setSelectedOwner}
                />

                {/* Kanban Board */}
                <DealsKanbanBoard dealsByStage={filteredDealsByStage} onDealClick={setSelectedDeal} />
            </div>

            {/* Deal Detail Sheet */}
            <DealDetailSheet
                deal={selectedDeal}
                open={!!selectedDeal}
                onOpenChange={(open) => !open && setSelectedDeal(null)}
            />
        </>
    )
}
