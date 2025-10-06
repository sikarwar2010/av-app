import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/", // root page
    "/unauthorized", // unauthorized page
    "/api/webhooks(.*)", // webhook endpoints
])

// Define admin-only routes that require elevated permissions
const isAdminRoute = createRouteMatcher([
    "/users(.*)", // User management
    "/settings(.*)", // System settings
    "/admin(.*)", // Admin dashboard
])

// Define manager-level routes (admin + manager access)
const isManagerRoute = createRouteMatcher([
    "/reports(.*)", // Advanced reporting
    "/analytics(.*)", // Data analytics
])

// Define standard protected routes that all authenticated users can access
const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/contacts(.*)",
    "/companies(.*)",
    "/deals(.*)",
    "/tasks(.*)",
    "/profile(.*)",
])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth()
    const pathname = req.nextUrl.pathname

    // Handle unauthenticated users
    if (!userId) {
        // Allow access to public routes
        if (isPublicRoute(req)) {
            return NextResponse.next()
        }

        // Redirect all other protected routes to sign-in
        if (isProtectedRoute(req) || isManagerRoute(req) || isAdminRoute(req)) {
            const signInUrl = new URL('/sign-in', req.url)
            signInUrl.searchParams.set('redirect_url', req.url)
            return NextResponse.redirect(signInUrl)
        }

        return NextResponse.next()
    }

    // Handle authenticated users
    // Redirect from root to dashboard only for authenticated users
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // For protected routes, allow access (component-level guards will handle role-based access)
    if (isAdminRoute(req) || isManagerRoute(req) || isProtectedRoute(req)) {
        return NextResponse.next()
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
