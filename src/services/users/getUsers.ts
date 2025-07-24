import axiosInstance from "@/api/axios.config";
import type { UserI } from "@/pages/private/users/interfaces/user";

interface UsersResponse {
    data: {
        data: UserI[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ParamsI {
    query?: string | null;
    page?: number;
    limit?: number;
}


export const getUsers = (params: ParamsI): Promise<UsersResponse> => {
    return axiosInstance.get(`v1/users`, { params });
}


