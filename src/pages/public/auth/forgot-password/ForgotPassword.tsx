import { ThemeToggle } from "@/components"
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"

const ForgotPassword = () => {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left side - Form */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex justify-between items-center">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold">Forgot password?</h1>
                            <p className="text-muted-foreground">No worries, we&apos;ll send you reset instructions</p>
                        </div>
                        <ThemeToggle />
                    </div>

                    <ForgotPasswordForm />
                </div>
            </div>

            {/* Right side - Image */}
            <div className="hidden lg:block relative bg-muted">
                <img src="/placeholder.svg?height=1080&width=1920" alt="Reset Password" className="object-cover w-full h-full absolute inset-0" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-8 left-8 text-white">
                    <h2 className="text-2xl font-bold mb-2">We&apos;ve got you covered</h2>
                    <p className="text-lg opacity-90">Reset your password securely and get back to your account</p>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword