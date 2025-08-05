import axiosInstance from "@/api/axios.config";
import type { CreateCustomer } from "@/pages/private/customers/interfaces/customers";

interface CreateCustomerPayload {
    payload: CreateCustomer;
}

export const createCustomer = (payload: CreateCustomerPayload) => {
    return axiosInstance.post(`customers/create`, payload)
}


