"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft, Home, Mail } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function UnauthorizedPage() {
    const router = useRouter();
    const { user } = useUser();
    const currentUser = useQuery(
        api.users.getCurrentUser,
        user ? { clerkId: user.id } : "skip"
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <Card className="max-w-lg w-full mx-4 shadow-lg">
                <CardHeader className="text-center pb-4">
                    <div className="mb-4">
                        <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                        Access Denied
                    </CardTitle>
                    <CardDescription className="text-base">
                        You don&apos;t have the required permissions to access this resource.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* User Info */}
                    {currentUser && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h3 className="font-semibold text-blue-900 mb-2">Your Current Access Level:</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-800">
                                        <span className="font-medium">{currentUser.firstName} {currentUser.lastName}</span>
                                    </p>
                                    <p className="text-sm text-blue-700 capitalize">
                                        Role: {currentUser.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Help Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Need Higher Access?</h3>
                        <p className="text-sm text-gray-600 mb-3">
                            If you believe you should have access to this feature, please contact your system administrator.
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-4 w-4 mr-2" />
                            Contact your administrator for permission requests
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            className="w-full"
                            size="lg"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>

                        <Button
                            onClick={() => router.push('/dashboard')}
                            className="w-full"
                            size="lg"
                        >
                            <Home className="h-4 w-4 mr-2" />
                            Go to Dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
