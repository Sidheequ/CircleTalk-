import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: `http://${window.location.hostname}:5001/api`,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        throw error;
    }
);