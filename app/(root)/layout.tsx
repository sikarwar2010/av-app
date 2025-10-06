"use client";

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { UserSyncProvider } from '@/components/auth/user-sync-provider';
import { useUser } from '@clerk/nextjs';

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user, isLoaded } = useUser();

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

    // Don't render content for unauthenticated users (middleware will handle redirect)
    if (!user) {
        return null;
    }

    return (
        <UserSyncProvider>
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </UserSyncProvider>
    );
}
