import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/", // root page
    "/unauthorized", // unauthorized page
    "/api/webhooks(.*)", // webhook endpoints
])

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/contacts(.*)",
    "/companies(.*)",
    "/deals(.*)",
    "/tasks(.*)",
    "/reports(.*)",
    "/settings(.*)",
    "/users(.*)",
])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();

    // If user is not authenticated and trying to access protected route
    if (!userId && isProtectedRoute(req)) {
        const { redirectToSignIn } = await auth();
        return redirectToSignIn();
    }

    // If user is authenticated and on root page, redirect to dashboard
    if (userId && req.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
