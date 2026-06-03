import { useCallback, useEffect, useState } from "react";
import DashboardService from "../../../services/DashboardService";
import type { DashboardStats } from "../../../types/dashboard.type";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function useDashboardStats(enabled = true) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  const fetchStats = useCallback(async () => {
    if (!enabled) {
      setStats(null);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await DashboardService.getStats();
      setStats(data.data);
    } catch (err) {
      setError(getErrorMessage(err, "Dashboard məlumatları yüklənmədi."));
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
}
