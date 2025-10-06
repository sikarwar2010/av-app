import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { Webhook } from "svix"
import { ConvexHttpClient } from "convex/browser"
import { api } from "../../../../convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Define types for Clerk webhook events
interface ClerkWebhookEvent {
    data: {
        id: string
        email_addresses: Array<{
            id: string
            email_address: string
        }>
        primary_email_address_id: string
        first_name?: string
        last_name?: string
        image_url?: string
    }
    type: string
}

export async function POST(req: Request) {
    // Verify webhook secret is configured
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
    if (!webhookSecret) {
        console.error("CLERK_WEBHOOK_SECRET is not configured")
        return new NextResponse("Webhook secret not configured", { status: 500 })
    }

    // Get the headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get("svix-id")
    const svix_timestamp = headerPayload.get("svix-timestamp")
    const svix_signature = headerPayload.get("svix-signature")

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error("Missing svix headers:", {
            svix_id: !!svix_id,
            svix_timestamp: !!svix_timestamp,
            svix_signature: !!svix_signature
        })
        return new NextResponse("Error occurred -- no svix headers", {
            status: 400,
        })
    }

    // Get the body
    let payload: unknown
    try {
        payload = await req.json()
    } catch (err) {
        console.error("Failed to parse webhook payload:", err)
        return new NextResponse("Invalid JSON payload", { status: 400 })
    }

    const body = JSON.stringify(payload)

    // Create a new Svix instance with your secret.
    const wh = new Webhook(webhookSecret)

    let evt: ClerkWebhookEvent

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as ClerkWebhookEvent
    } catch (err) {
        console.error("Error verifying webhook:", err)
        return new NextResponse("Error occurred", {
            status: 400,
        })
    }

    // Handle the webhook
    const { id } = evt.data
    const eventType = evt.type

    console.log(`Webhook with an ID of ${id} and type of ${eventType}`)
    console.log("Webhook body:", body)

    try {
        if (eventType === "user.created" || eventType === "user.updated") {
            const { id: clerkId, email_addresses, first_name, last_name, image_url } = evt.data

            // Validate that email_addresses exists and is an array
            if (!email_addresses || !Array.isArray(email_addresses) || email_addresses.length === 0) {
                console.error("No email addresses found for user:", clerkId)
                return new NextResponse("No email addresses found", { status: 400 })
            }

            // Get primary email
            const primaryEmail = email_addresses.find((email) => email.id === evt.data.primary_email_address_id)

            if (!primaryEmail) {
                console.error("No primary email found for user:", clerkId)
                return new NextResponse("No primary email found", { status: 400 })
            }

            await convex.mutation(api.users.upsertUser, {
                clerkId,
                email: primaryEmail.email_address,
                firstName: first_name || "",
                lastName: last_name || "",
                imageUrl: image_url || undefined,
                // Don't pass role to preserve existing user roles
                // New users will get default "sales" role from upsertUser function
            })

            console.log(`User ${eventType === "user.created" ? "created" : "updated"} in Convex:`, clerkId)
        }

        if (eventType === "user.deleted") {
            const { id: clerkId } = evt.data

            try {
                const user = await convex.query(api.users.getCurrentUser, { clerkId })
                if (user) {
                    // For user deletion from webhook, we need to handle it differently
                    // since the user is already deleted from Clerk
                    await convex.mutation(api.users.deactivateUserByClerkId, {
                        clerkId: clerkId,
                    })
                    console.log("User deactivated in Convex:", clerkId)
                } else {
                    console.log("User not found in Convex for deletion:", clerkId)
                }
            } catch (userError) {
                console.error("Error handling user deletion:", userError)
                // Don't fail the webhook for user deletion errors
            }
        }

        return NextResponse.json({
            message: "Webhook processed successfully",
            eventType,
            userId: id
        })
    } catch (error) {
        console.error("Error processing webhook:", error)
        return new NextResponse("Error processing webhook", { status: 500 })
    }
}
