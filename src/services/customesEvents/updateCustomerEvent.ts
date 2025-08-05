import axiosInstance from "@/api/axios.config";
import type { CreateCustomerEventFormData } from "@/pages/private/event/interfaces/customerEvent";

interface UpdateEventPayload {
    id: number;
    payload: CreateCustomerEventFormData
}

export const updateCustomerEvent = ({ id, payload }: UpdateEventPayload) => {
    return axiosInstance.patch(`customersEvents/${id}`, payload)
}


