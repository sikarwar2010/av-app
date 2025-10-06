"use client";

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
        // Redirect unauthenticated users to sign-in
        if (isLoaded && !user) {
            router.push('/sign-in');
        }
    }, [isLoaded, user, router]);

    // Show loading while checking auth status
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render protected content for unauthenticated users
    if (!user) {
        return null;
    }

    return (
        <div>
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </div>
    );
}
