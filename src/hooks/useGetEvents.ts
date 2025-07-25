import type { Event } from "@/pages/private/event/interfaces/Event";
import { getEvents, type ParamsI } from "@/services/events/getEvents";
import { useState } from "react";

export const useGetEvents = () => {
    const [data, setData] = useState<Event[]>();
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = async ({ query, page, limit }: ParamsI) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getEvents({ query, page, limit });
            console.log("🚀 ~ fetchUsers ~ response:", response)
            if (!response) {
                throw new Error('Failed to fetch users');
            };

            const { data, limit: currentLimit, page: currentPage, total, totalPages } = response.data;

            setData(data);
            setLimit(currentLimit);
            setPage(currentPage);
            setTotal(total);
            setTotalPages(totalPages);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error al obtener los usuarios');
        } finally {
            setIsLoading(false);
        }
    }
    return {
        data,
        isLoading,
        error,
        fetchEvents,
        limit,
        setLimit,
        page,
        setPage,
        total,
        setTotal,
        totalPages,
        setTotalPages
    };
}