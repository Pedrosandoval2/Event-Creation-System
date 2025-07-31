import { LoginForm, ThemeToggle } from "@/components"

const Login = () => {

    return (
        (
            <div className="min-h-screen grid lg:grid-cols-2">
                {/* Left side - Form */}
                <div className="flex items-center justify-center p-8">
                    <div className="w-full max-w-md space-y-8">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2 text-center">
                                <h1 className="text-3xl font-bold">Welcome back</h1>
                                <p className="text-muted-foreground">Enter your credentials to access your account</p>
                            </div>
                            <ThemeToggle />
                        </div>

                        <LoginForm />
                    </div>
                </div>

                {/* Right side - Image */}
                <div className="hidden lg:block relative bg-muted">
                    {/* <Image src="/placeholder.svg?height=1080&width=1920" alt="Authentication" fill className="object-cover" /> */}
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-8 left-8 text-white">
                        <h2 className="text-2xl font-bold mb-2">Join thousands of users</h2>
                        <p className="text-lg opacity-90">Experience the power of our platform</p>
                    </div>
                </div>
            </div>
        )
    )
}

export default Login