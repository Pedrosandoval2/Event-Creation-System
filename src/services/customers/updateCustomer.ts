import axiosInstance from "@/api/axios.config";
import type { Customer } from "@/pages/private/customers/interfaces/customers";

interface UpdateEventPayload {
    id: number;
    payload: Omit<Customer, 'id' | 'createdAt'>;
}

export const updateCustomer = ({ id, payload }: UpdateEventPayload) => {
    return axiosInstance.patch(`customers/update/${id}`, payload)
}


