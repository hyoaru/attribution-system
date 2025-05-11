import axios from "axios";

export const AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_CORE_API_BASE_URL,
    headers: {
        Accept: "application/json",
    },
});

AxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.withCredentials = true;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
