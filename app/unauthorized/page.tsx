"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                <div className="mb-6">
                    <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Access Denied
                    </h1>
                    <p className="text-gray-600">
                        You don&apos;t have permission to access this resource.
                        Please contact your administrator if you believe this is an error.
                    </p>
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                        className="w-full"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back
                    </Button>

                    <Button
                        onClick={() => router.push('/dashboard')}
                        className="w-full"
                    >
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}
