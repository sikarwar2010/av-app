"use client"

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
    children: React.ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class AuthErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Authentication Error:', error, errorInfo)

        // Log to external service in production
        if (process.env.NODE_ENV === 'production') {
            // You can integrate with error tracking services like Sentry here
            console.error('Auth Error Details:', {
                error: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack
            })
        }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null })
        window.location.reload()
    }

    handleGoToSignIn = () => {
        window.location.href = '/sign-in'
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <CardTitle className="text-xl">Authentication Error</CardTitle>
                            <CardDescription>
                                We encountered an issue with authentication. This might be a temporary problem.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-800 font-medium">Error Details:</p>
                                    <p className="text-xs text-red-600 mt-1 font-mono">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Button
                                    onClick={this.handleRetry}
                                    className="w-full"
                                    variant="default"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Try Again
                                </Button>

                                <Button
                                    onClick={this.handleGoToSignIn}
                                    className="w-full"
                                    variant="outline"
                                >
                                    Go to Sign In
                                </Button>
                            </div>

                            <div className="text-xs text-muted-foreground text-center space-y-1">
                                <p>If this problem persists, try:</p>
                                <ul className="text-left space-y-1">
                                    <li>• Clearing your browser cache and cookies</li>
                                    <li>• Using an incognito/private browser window</li>
                                    <li>• Checking your internet connection</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )
        }

        return this.props.children
    }
}
