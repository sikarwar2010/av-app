import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import ConvexClientProvider from '../components/providers/ConvexClientProvider';
import { UserSyncProvider } from '../components/auth/user-sync-provider';
import { Suspense } from 'react';
import { Toaster } from '../components/ui/sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AV Valve Ltd - CRM System",
  description: "Customer Relationship Management System for AV Valve Ltd",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#000000",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ConvexClientProvider>
            <UserSyncProvider>
              <Suspense fallback={null}>
                {children}
                <Toaster />
              </Suspense>
            </UserSyncProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
