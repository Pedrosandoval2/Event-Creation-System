import axiosInstance from "@/api/axios.config";
import type { EventCustomer } from "@/pages/private/event/interfaces/customerEvent";



interface CustomerEventResponse {
    data: EventCustomer[];
}

interface CustomerEventParams {
    id?: number;
}

export const getCustomerEvent = ({ id }: CustomerEventParams): Promise<CustomerEventResponse> => {
    return axiosInstance.get(`customersEvents/all/${id}`);
}


