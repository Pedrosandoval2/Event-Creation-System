import type { UserI } from "@/pages/private/users/interfaces/user";
import { getUsers, type ParamsI } from "@/services/users/getUsers";
import { useState } from "react";

export const useGetUsers = () => {
    const [data, setData] = useState<UserI[]>();
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async ({ query, page, limit }: ParamsI) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getUsers({ query, page, limit });
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
        fetchUsers,
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