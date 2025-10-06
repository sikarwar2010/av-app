import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface UnauthorizedMessageProps {
    message?: string;
    showUnauthorizedLink?: boolean;
}

export function UnauthorizedMessage({
    message = "You don&apos;t have permission to access this feature.",
    showUnauthorizedLink = false
}: UnauthorizedMessageProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Access Denied
            </h3>
            <p className="text-gray-600 mb-4 max-w-md">
                {message}
            </p>
            {showUnauthorizedLink && (
                <Link href="/unauthorized">
                    <Button variant="outline">
                        Learn More
                    </Button>
                </Link>
            )}
        </div>
    );
}
