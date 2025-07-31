import axiosInstance from "@/api/axios.config";
import type { Event } from "@/pages/private/event/interfaces/event";

interface EventsResponse {
    data: {
        data: Event[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ParamsI {
    query?: string | null;
    page?: number;
    limit?: number;
}


export const getEvents = (params: ParamsI): Promise<EventsResponse> => {
    return axiosInstance.get(`events`, { params });
}


