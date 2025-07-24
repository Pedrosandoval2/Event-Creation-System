import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/components"
import type { ForgotPasswordI } from "@/pages/public/auth/forgot-password/interfaces/ForgotPasswordI";
import { forgotPasswordSchema } from "@/pages/public/auth/forgot-password/schema/schema";
import { ForgotPasswordServices } from "@/services/auth/forgotPassword";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, Loader2 } from "lucide-react"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom"
import { toast } from "react-toastify";


// TODO: Falta implementar el servicio de forgot password en el backend
export const ForgotPasswordForm = () => {

    const [isCorrectShipment, setIsCorrectShipment] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordI>({
        resolver: yupResolver(forgotPasswordSchema),
        mode: 'onChange'
    });

    const onSubmit = async (data: ForgotPasswordI) => {
        setIsLoading(true);
        try {
            const response = await ForgotPasswordServices(data);
            if (response.status !== 201) {
                toast.error("Login failed. Please check your credentials.");
            }
            // Aún está por evaluar que iría aquí en el backend, faltaría devovler una respuesta de exito
            // o error, por ahora se asume que siempre es correcto.
            setIsCorrectShipment(true)
            toast.success(" Login successful!");

        } catch (error) {
            console.log("🚀 ~ onSubmit ~ error:", error)
            toast.error("Error during login. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <>
            {isCorrectShipment ?
                <div className="px-4 py-2 bg-green-600 text-white rounded-md ">
                    <span>Se le brindará un link para cambiar su contraseña</span>
                    <p>Verificar en su bandeja de entrada, por favor.</p>
                    <div className="flex mt-4 justify-center">
                        <Button><Link to={'https://mail.google.com/mail/u/0/#inbox'}> ir a correo </Link></Button>
                    </div>

                </div>
                : (
                    <Card onSubmit={handleSubmit(onSubmit)}>

                        <CardHeader>
                            <CardTitle>Reset Password</CardTitle>
                            <CardDescription>
                                Enter your email address and we&apos;ll send you a link to reset your password
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="john@example.com" {...register('email')} />
                                {errors.email && <span className='text-red-600'>{errors.email.message}</span>}
                            </div>
                            <Button className="w-full" asChild>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send"
                                )}
                            </Button>
                            <Button variant="ghost" className="w-full" asChild>
                                <Link to="/login" className="flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to login
                                </Link>
                            </Button>
                        </CardContent>

                    </Card>
                )}
        </>
    )
}
