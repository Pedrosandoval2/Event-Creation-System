import type { AuthStoreILocalStorage } from '@/store/authStoreI';
import axios from 'axios';
import { redirect } from 'react-router-dom';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

const getTokenFromStorage = (): string | null => {
    try {
        const data = JSON.parse(localStorage.getItem('user') || 'null') as AuthStoreILocalStorage | null;
        return data?.state.user?.accessToken || null;
    } catch (err) {
        console.log("🚀 ~ err:", err)
        return null;
    }
};

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getTokenFromStorage();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error.response && error.response.status === 401) {
            console.warn("🔒 Sesión expirada o token inválido. Cerrando sesión...");
            localStorage.removeItem('user');
            redirect('/login')
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
