import axiosInstance from "@/api/axios.config";
import type { ForgotPasswordI } from "@/pages/public/auth/forgot-password/interfaces/ForgotPasswordI";

interface ForgotPasswordResponse {
    data: { message: string };
    status: number;
}

export const ForgotPasswordServices = (authForgotPassword: ForgotPasswordI): Promise<ForgotPasswordResponse> => {
    return axiosInstance.post('/auth/forgot-password', authForgotPassword)
}