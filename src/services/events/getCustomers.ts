import axiosInstance from "@/api/axios.config";
import type { Customer } from "@/pages/private/event/interfaces/event";

interface CustomerResponse {
    data: Customer[];
}

interface CustomerParams {
    idEvent: number;
}

export const getCustomers = (params: CustomerParams): Promise<CustomerResponse> => {
    return axiosInstance.get(`customers`, { params });
}


