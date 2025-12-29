import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:5001`;

export const axiosInstance = axios.create({
    baseURL: `${BASE_API_URL}/api`,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        throw error;
    }
);