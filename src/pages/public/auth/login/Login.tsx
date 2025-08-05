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
                <div className="hidden lg:block relative bg-muted w-[100%] max-w-[1200px] mx-auto h-full">
                    <img
                        src="/public/assets/MARIATEGUI.webp"
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Logo"
                    />
                </div>
            </div>
        )
    )
}

export default Login