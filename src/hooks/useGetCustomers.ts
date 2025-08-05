
import type { Customer } from "@/pages/private/customers/interfaces/customers";
import { getCustomers, type CustomerParams } from "@/services/customers/getCustomers";
import { useState } from "react";

export const useGetCustomers = () => {
    const [data, setData] = useState<Customer[]>();
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [totalCustomers, setTotalCustomers] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomers = async (params: CustomerParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getCustomers(params);
            if (!response) {
                throw new Error('Failed to fetch users');
            };

            const { data, limit: currentLimit, page: currentPage, totalCustomers, totalPages } = response.data;

            setData(data);
            setLimit(currentLimit);
            setPage(currentPage);
            setTotalCustomers(totalCustomers);
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
        setIsLoading,
        error,
        fetchCustomers,
        limit,
        setLimit,
        page,
        setPage,
        totalCustomers,
        setTotalCustomers,
        totalPages,
        setTotalPages
    };
}