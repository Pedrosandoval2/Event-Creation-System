import { ThemeToggle, RegisterForm } from '@/components';

const Register = () => {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left side - Form */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex justify-between items-center">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold">Create account</h1>
                            <p className="text-muted-foreground">Enter your information to get started</p>
                        </div>
                        <ThemeToggle />
                    </div>
                    <RegisterForm />
                </div>
            </div>

            <div className="hidden lg:block relative bg-muted">
                {/* <Image src="/placeholder.svg?height=1080&width=1920" alt="Authentication" fill className="object-cover" /> */}
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-8 left-8 text-white">
                    <h2 className="text-2xl font-bold mb-2">Start your journey today</h2>
                    <p className="text-lg opacity-90">Join our community and unlock amazing features</p>
                </div>
            </div>
        </div>
    )
}

export default Register