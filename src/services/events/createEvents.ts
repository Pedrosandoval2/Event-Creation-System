import axiosInstance from "@/api/axios.config";

interface CreateEventPayload {
    name_event: string;
    description?: string;
    price_unit: number;
    start_date: string;
    end_date: string;
}

export const createEvents = (payload: CreateEventPayload) => {
    return axiosInstance.post(`events/create`, payload)
}


