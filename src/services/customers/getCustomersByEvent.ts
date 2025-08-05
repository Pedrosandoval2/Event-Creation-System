import axiosInstance from "@/api/axios.config";
import type { Customer } from "@/pages/private/customers/interfaces/customers";

interface CustomerParamsByEventResponse {
    data: Customer[];
}

interface CustomerParamsByEvent {
    idEvent: number;
}

export const getCustomersByEvent = (params: CustomerParamsByEvent): Promise<CustomerParamsByEventResponse> => {
    return axiosInstance.get(`customers`, { params });
}


