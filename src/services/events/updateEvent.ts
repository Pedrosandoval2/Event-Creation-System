import axiosInstance from "@/api/axios.config";

interface UpdateEventPayload {
    id: number;
    payload: {
        name_event: string;
        description?: string;
        price_unit: number;
        start_date: string;
        end_date: string;
    }
}

export const updateEvents = ({ id, payload }: UpdateEventPayload) => {
    return axiosInstance.patch(`events/update/${id}`, payload)
}


