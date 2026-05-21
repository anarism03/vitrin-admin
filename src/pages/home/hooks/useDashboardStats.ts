import { useCallback, useEffect, useRef, useState } from "react";
import DashboardService from "../../../services/DashboardService";
import type { DashboardStats } from "../../../types/dashboard.type";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loaded = useRef(false);

  const fetchStats = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    void fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
}
