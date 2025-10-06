"use client";

import { SignInButton, UserButton } from '@clerk/nextjs';
import { Authenticated, Unauthenticated } from 'convex/react';

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Authenticated>
        <UserButton />
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <h1 className="text-4xl font-bold">
        Welcome to <span className="text-blue-500">Clerk</span>
      </h1>

    </div>
  );
}
