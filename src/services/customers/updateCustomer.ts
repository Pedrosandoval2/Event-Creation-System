import axiosInstance from "@/api/axios.config";
import type { CreateCustomer } from "@/pages/private/customers/interfaces/customers";

interface UpdateEventPayload {
    id: number;
    payload: CreateCustomer;
}

export const updateCustomer = ({ id, payload }: UpdateEventPayload) => {
    return axiosInstance.patch(`customers/update/${id}`, payload);
}


