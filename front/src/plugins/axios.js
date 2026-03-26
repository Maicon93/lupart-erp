import axios from 'axios';
import { toast } from 'vue3-toastify';
import i18n from '../i18n';
import { useAuthStore } from '../stores/auth';
import { useEnterpriseStore } from '../stores/enterprise';

const $api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/refresh-token'];

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    failedQueue = [];
};

const executeLogout = () => {
    const authStore = useAuthStore();
    const enterpriseStore = useEnterpriseStore();

    authStore.clearAuth();
    enterpriseStore.clearCompany();

    window.location.href = '/login';
};

// Request Interceptor
$api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Response Interceptor
$api.interceptors.response.use(
    (response) => {
        const { type, messageCode } = response.data || {};
        const { t } = i18n.global;

        if (messageCode) {
            const message = t(messageCode);
            const toastMethod = toast[type] || toast.info;
            toastMethod(message);
        }

        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const { t } = i18n.global;

        // Toast de erro da API
        const { type, messageCode } = error.response?.data || {};
        if (messageCode && status !== 401) {
            const message = t(messageCode);
            const toastMethod = toast[type] || toast.error;
            toastMethod(message);
        }

        // 401 — Refresh token flow
        if (status === 401 && !originalRequest._retry) {
            const isAuthRoute = AUTH_ROUTES.some((route) => originalRequest.url?.includes(route));

            if (isAuthRoute) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return $api(originalRequest);
                    })
                    .catch((queueError) => Promise.reject(queueError));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await refreshApi.post('/auth/refresh-token', null, {
                    withCredentials: true,
                });

                const newToken = data.data.token;
                localStorage.setItem('token', newToken);

                const authStore = useAuthStore();
                authStore.token = newToken;

                processQueue(null, newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return $api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                executeLogout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export const axiosPlugin = {
    install(app) {
        app.provide('$api', $api);
    },
};

export { $api };
