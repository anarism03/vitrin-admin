import type { DashboardStatsResponse } from "../types/dashboard.type";
import axiosInstance from "./axiosInstance";

export const DashboardService = {
  getStats: () => axiosInstance.get<DashboardStatsResponse>("/dashboard/stats"),
};
