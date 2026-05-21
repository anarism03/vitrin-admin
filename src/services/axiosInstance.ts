import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { RefreshResponse } from "../types/auth.type";
import {
  clearAuthStorage,
  getAuthTokens,
  saveAuthTokens,
} from "../utils/authStorage";

const API_URL = import.meta.env.VITE_API_URL || "";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

type RetryRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };
type ApiEnvelope<T> = T | { data: T };

const unwrapResponse = <T>(data: ApiEnvelope<T>): T => {
  if (data && typeof data === "object" && "data" in data) {
    return data.data;
  }

  return data as T;
};

const redirectToLogin = () => {
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
};

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tokens = getAuthTokens();

  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry || originalRequest.url?.includes("/auth/login")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const tokens = getAuthTokens();
      if (!tokens?.refreshToken) throw new Error("Refresh token yoxdur");

      const { data } = await axios.post<ApiEnvelope<RefreshResponse>>(
        `${API_URL}/auth/refresh`,
        { refreshToken: tokens.refreshToken },
        { headers: { "Content-Type": "application/json;charset=utf-8" } },
      );

      const payload = unwrapResponse(data);
      const accessToken = payload.accessToken ?? payload.access_token;
      const refreshToken = payload.refreshToken ?? payload.refresh_token;

      if (!accessToken || !refreshToken) throw new Error("Token yenilənmədi");

      saveAuthTokens({ accessToken, refreshToken });
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;
