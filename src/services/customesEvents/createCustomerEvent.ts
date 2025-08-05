import axiosInstance from "@/api/axios.config";
import type { CreateCustomerEventFormData } from "@/pages/private/event/interfaces/customerEvent";


export const createCustomerEvent = (payload: CreateCustomerEventFormData) => {
    return axiosInstance.post(`customersEvents/create`, payload)
}


