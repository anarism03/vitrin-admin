import type { DashboardStatsResponse } from "../types/dashboard.type";
import axiosInstance from "./axiosInstance";

const DashboardService = {
  getStats: () => axiosInstance.get<DashboardStatsResponse>("/dashboard/stats"),
};

export default DashboardService;
