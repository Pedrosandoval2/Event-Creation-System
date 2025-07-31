import type { AxiosResponse } from "axios";
import { toast } from "react-toastify";

export const getErrorFetch = (response: AxiosResponse) => {
    if (!response || response.status < 200 || response.status >= 300) {
        toast.error("Error al guardar el evento");
        throw new Error(response?.statusText || "Error desconocido");
    }
}
