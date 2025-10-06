import { SignUp } from '@clerk/nextjs'

export default function Page() {
    return (
        <SignUp
            afterSignInUrl="/dashboard"
            afterSignUpUrl="/dashboard"
            signInUrl="/sign-in"
            redirectUrl="/dashboard"
            appearance={{
                elements: {
                    formButtonPrimary: "bg-primary hover:bg-primary/90",
                    card: "shadow-lg",
                }
            }}
        />
    )
}
