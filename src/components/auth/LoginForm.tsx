
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label } from '@/components';
import { Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LoginSchema } from '@/pages/public/auth/login/schema/schema';
import { yupResolver } from "@hookform/resolvers/yup";
import { loginServices } from '@/services/auth/loginServices';
import { toast } from 'react-toastify';

import type { LoginI } from '@/pages/public/auth/login/interfaces/loginI';
import { useAuthStore } from '@/store/authStore';
import { decoded } from '@/utils/decoded';


export const LoginForm = () => {

    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginI>({
        resolver: yupResolver(LoginSchema),
        mode: 'onChange'
    });

    const onSubmit = async (data: LoginI) => {
        setIsLoading(true);
        try {
            const response = await loginServices(data);
            if (response.status !== 201) {
                toast.error("Login failed. Please check your credentials.");
            }

            const accessToken = response.data.accessToken;

            const user = await decoded(accessToken)
            setUser({ firstName: user.firstName, lastName: user.lastName, accessToken: accessToken, id: user.id, email: user.email, role: user.role, isActive: user.isActive });

            toast.success(" Login successful!");
            navigate('/dashboard');

        } catch (error) {
            console.log("🚀 ~ onSubmit ~ error:", error)
            toast.error("Error during login. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Enter your email and password to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4" >
                        <div className="space-y-2">
                            <label htmlFor="email">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                {...register('email')}
                            />
                            {errors.email && <span className='text-red-600'>{errors.email.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                            />
                            {errors.password && <span className='text-red-600'>{errors.password.message}</span>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading} >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>
                        <Button type="button" variant="outline" className="w-full bg-transparent">
                            Continue with Google
                        </Button>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link to="/register" className="text-primary hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </form>
        </Card>
    )
}
