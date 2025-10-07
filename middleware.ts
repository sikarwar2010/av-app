import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
    '/',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks/clerk',
    '/unauthorized'
])

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/admin(.*)',
    '/companies(.*)',
    '/contacts(.*)',
    '/deals(.*)',
    '/users(.*)',
    '/api/send-invitation'
])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth()
    const { pathname } = req.nextUrl

    // Allow public routes without authentication
    if (isPublicRoute(req)) {
        return NextResponse.next()
    }

    // Redirect unauthenticated users from protected routes to sign-in
    if (isProtectedRoute(req) && !userId) {
        const signInUrl = new URL('/sign-in', req.url)
        signInUrl.searchParams.set('redirect_url', pathname)
        return NextResponse.redirect(signInUrl)
    }

    // Redirect authenticated users away from auth pages to dashboard
    if (userId && (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up'))) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect authenticated users from root to dashboard
    if (userId && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
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
