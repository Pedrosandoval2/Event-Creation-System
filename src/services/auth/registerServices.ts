import axiosInstance from "@/api/axios.config";
import type { LoginI } from "@/pages/public/auth/login/interfaces/loginI";


interface RegisterResponse {
    data: { accessToken: string };
    status: number;
}

export const RegisterServices = (authRegister: LoginI): Promise<RegisterResponse> => {
    return axiosInstance.post('/auth/register', authRegister)
}