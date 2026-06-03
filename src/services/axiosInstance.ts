import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { RefreshResponse } from "../types/auth.type";
import {
  clearAuthStorage,
  getAuthTokens,
  saveAuthTokens,
} from "../utils/authStorage";
import { API_URL } from "./apiUrl";

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

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const tokens = getAuthTokens();
      if (!tokens?.refreshToken) throw new Error("Refresh token yoxdur");

      const { data } = await axios.post<ApiEnvelope<RefreshResponse>>(
        `${API_URL}/auth/refresh`,
        { refreshToken: tokens.refreshToken },
        { headers: { "Content-Type": "application/json;charset=utf-8" } },
      );

      const payload = unwrapResponse(data);
      const accessToken = payload.accessToken ?? (payload as any).access_token;
      const refreshToken = payload.refreshToken ?? (payload as any).refresh_token;

      if (!accessToken || !refreshToken) throw new Error("Token yenilənmədi");

      saveAuthTokens({ accessToken, refreshToken });
      
      processQueue(null, accessToken);
      
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAuthStorage();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
