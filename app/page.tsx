"use client"

import { SignInButton, UserButton } from '@clerk/nextjs';
import { Authenticated, Unauthenticated } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (isLoaded && user) {
      router.replace('/dashboard');
    }
  }, [isLoaded, user, router]);

  // Show loading while checking auth status
  if (!isLoaded) {
    return (
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to <span className="text-blue-500">AV Valve Ltd</span>
          </h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show content for authenticated users (they'll be redirected)
  if (user) {
    return (
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <div className="text-center">
          <UserButton />
          <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Unauthenticated>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">
            Welcome to <span className="text-blue-500">AV Valve Ltd</span>
          </h1>
          <p className="text-gray-600 mb-6">Please sign in to access your CRM dashboard</p>
          <SignInButton
            mode="redirect"
            signUpForceRedirectUrl="/dashboard"
            forceRedirectUrl="/dashboard"
          >
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              Sign In
            </button>
          </SignInButton>
        </div>
      </Unauthenticated>
    </div>
  );
}
