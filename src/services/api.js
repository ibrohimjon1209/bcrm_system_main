import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'https://apidemobcrm.nsdcorporation.uz';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { response } = error;

    const isAuthEndpoint =
      originalRequest.url.includes('/api/auth/login/') ||
      originalRequest.url.includes('/api/auth/logout/') ||
      originalRequest.url.includes('/api/auth/token/refresh/');

    if (response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        const refresh = getRefreshToken();
        if (!refresh) throw new Error('No refresh token');

        const refreshResponse = await axios.post(`${API_URL}/api/auth/token/refresh/`, { refresh });
        const { access, refresh: newRefresh } = refreshResponse.data;
        localStorage.setItem('access_token', access);
        if (newRefresh) localStorage.setItem('refresh_token', newRefresh);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch {1
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        if (!window.location.pathname.includes('/login')) {
          toast.error('Seans muddati tugadi. Iltimos, qaytadan kiring.');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

      const errorMessage =
        response?.data?.detail ||
        response?.data?.message ||
        (response?.data && typeof response.data === 'object'
          ? Object.values(response.data).flat()[0]
          : null) ||
        'Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.';

      const isReportEndpoint = originalRequest?.url?.includes('/api/reports/');
      if (
        response?.status !== 401 &&
        response?.status !== 403 &&
        !(response?.status >= 500 && isReportEndpoint)
      ) {
        toast.error(errorMessage);
      }

      return Promise.reject(error);1
    }
  );

export default api;
