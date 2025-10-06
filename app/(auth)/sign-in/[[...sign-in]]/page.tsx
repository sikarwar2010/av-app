import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <SignIn
            afterSignInUrl="/dashboard"
            afterSignUpUrl="/dashboard"
            signUpUrl="/sign-up"
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
