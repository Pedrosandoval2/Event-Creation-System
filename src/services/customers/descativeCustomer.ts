import axiosInstance from "@/api/axios.config";

export const desactiveCustomer = ({ id }: { id: number }) => {
    return axiosInstance.put(`customers/delete/${id}`);
}


