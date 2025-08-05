import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '@/components';
import { Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { RegisterI } from '@/pages/public/auth/register/interfaces/registerI';
import { yupResolver } from '@hookform/resolvers/yup';
import { RegisterSchema } from '@/pages/public/auth/register/schema/schema';
import { toast } from 'react-toastify';
import { decoded } from '@/utils/decoded';
import { useAuthStore } from '@/store/authStore';
import { RegisterServices } from '@/services/auth/registerServices';



export const RegisterForm = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { handleSubmit, register, formState: { errors } } = useForm<RegisterI>({
        resolver: yupResolver(RegisterSchema),
        mode: 'onChange'
    });


    const onSubmit = async (data: RegisterI) => {
        setIsLoading(true);
        try {
            const response = await RegisterServices(data);
            if (response.status !== 201) {
                toast.error("Login failed. Please check your credentials.");
            }

            const accessToken = response.data.accessToken;

            const user = decoded(accessToken)
            setUser({ ...user, accessToken });

            toast.success(" Login successful!");
            navigate('/dashboard');

        } catch (error) {
            console.log("🚀 ~ onSubmit ~ error:", error)
            toast.error("Error during login. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Create your account to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="John"
                                    {...register('firstName')}
                                />
                                {errors.firstName && <span className='text-red-600'>{errors.firstName.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Doe"
                                    {...register('lastName')}
                                />
                                {errors.lastName && <span className='text-red-600'>{errors.lastName.message}</span>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                {...register('email')}
                            />
                            {errors.email && <span className='text-red-600'>{errors.email.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="*********"
                                {...register('password')}
                            />
                            {errors.password && <span className='text-red-600'>{errors.password.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Re-enter your password"
                                {...register('resetPassword')}
                            />
                            {errors.resetPassword && <span className='text-red-600'>{errors.resetPassword.message}</span>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
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
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </form>
        </Card>
    )
}
