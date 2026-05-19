import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  clearAuthSession,
  readAccessToken,
  readRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from "../auth/authStorage";
import type { RefreshResponse } from "../types/auth.type";

const API_URL = import.meta.env.VITE_API_URL || "";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

const refreshClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

const PUBLIC_AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/verify-email",
  "/auth/resend-verification-code",
];

type RetryRequestConfig = AxiosRequestConfig & { _retry?: boolean };
type ApiEnvelope<T> = T | { data: T };
type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let pendingQueue: QueueItem[] = [];

const requestUrl = (config?: AxiosRequestConfig) => config?.url || "";

const isPublicAuthRequest = (config?: AxiosRequestConfig) => {
  const url = requestUrl(config);
  return PUBLIC_AUTH_PATHS.some((path) => url.includes(path));
};

const redirectToLogin = () => {
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
};

const unwrapResponse = <T>(data: ApiEnvelope<T>): T => {
  if (data && typeof data === "object" && "data" in data) {
    return data.data;
  }

  return data as T;
};

const resolveQueue = (token: string) => {
  pendingQueue.forEach(({ resolve }) => resolve(token));
  pendingQueue = [];
};

const rejectQueue = (error: unknown) => {
  pendingQueue.forEach(({ reject }) => reject(error));
  pendingQueue = [];
};

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = readAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
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

    if (isPublicAuthRequest(originalRequest)) {
      return Promise.reject(error);
    }

    if (requestUrl(originalRequest).includes("/auth/refresh")) {
      clearAuthSession();
      redirectToLogin();
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            originalRequest.headers = {
              ...(originalRequest.headers || {}),
              Authorization: `Bearer ${token}`,
            };
            resolve(axiosInstance(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = readRefreshToken();
      if (!refreshToken) {
        throw new Error("Refresh token yoxdur");
      }

      const { data } = await refreshClient.post<ApiEnvelope<RefreshResponse>>(
        "/auth/refresh",
        { refreshToken },
      );

      const inner = unwrapResponse(data);
      const newAccessToken = inner.accessToken ?? inner.access_token;
      const newRefreshToken = inner.refreshToken ?? inner.refresh_token;

      if (!newAccessToken) {
        throw new Error("Refresh cavabında access token yoxdur");
      }

      saveAccessToken(newAccessToken);
      if (newRefreshToken) {
        saveRefreshToken(newRefreshToken);
      }

      resolveQueue(newAccessToken);

      originalRequest.headers = {
        ...(originalRequest.headers || {}),
        Authorization: `Bearer ${newAccessToken}`,
      };

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      rejectQueue(refreshError);
      clearAuthSession();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
