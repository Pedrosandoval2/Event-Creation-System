import axiosInstance from "@/api/axios.config";
import type { Customer } from "@/pages/private/customers/interfaces/customers";

interface CustomerResponse {
    data: {
        data: Customer[];
        limit: number;
        page: number;
        totalCustomers: number;
        totalPages: number;
    }
}

export interface CustomerParams {
    query?: string;
    page?: number;
    limit?: number;
}

export const getCustomers = (params: CustomerParams): Promise<CustomerResponse> => {
    return axiosInstance.get(`customers/all`, { params });
}


