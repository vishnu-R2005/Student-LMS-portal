import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE,
});

const refreshClient = axios.create({
  baseURL: API_BASE,
});

export const getStoredTokens = () => ({
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
});

api.interceptors.request.use((config) => {
  const { accessToken: token } = getStoredTokens();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setupAuthInterceptors = ({ onTokenRefresh, onAuthFailure }) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;
      const isRefreshRequest = originalRequest?.url?.includes("/token/refresh/");

      if (status !== 401 || originalRequest?._retry || isRefreshRequest) {
        return Promise.reject(error);
      }

      const { refreshToken } = getStoredTokens();
      if (!refreshToken) {
        onAuthFailure?.();
        return Promise.reject(error);
      }

      try {
        originalRequest._retry = true;
        const { data } = await refreshClient.post("/token/refresh/", {
          refresh: refreshToken,
        });
        localStorage.setItem("accessToken", data.access);
        if (data.refresh) {
          localStorage.setItem("refreshToken", data.refresh);
        }
        onTokenRefresh?.(data);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        onAuthFailure?.();
        return Promise.reject(refreshError);
      }
    }
  );
};

export default api;
