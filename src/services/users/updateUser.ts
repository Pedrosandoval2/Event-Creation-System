import axiosInstance from "@/api/axios.config";

interface EditUserPayload {
    id: string;
    payload: {
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        isActive: boolean;
    }
}

export const editUser = ({ id, payload }: EditUserPayload) => {
    return axiosInstance.patch(`v1/users/${id}`, payload)
}


