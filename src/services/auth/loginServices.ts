import axiosInstance from "@/api/axios.config";
import type { LoginI } from "@/pages/public/auth/login/interfaces/loginI";


interface LoginResponse {
    data: { accessToken: string };
    status: number;
}

export const loginServices = (authLogin: LoginI): Promise<LoginResponse> => {
    return axiosInstance.post('/auth/login', authLogin)
}