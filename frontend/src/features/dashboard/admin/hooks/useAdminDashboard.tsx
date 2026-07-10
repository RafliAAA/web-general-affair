import { useState, useEffect } from "react";
import { toast } from "sonner";
import { dashboardService } from "../services/adminDashboardService";
import type { DashboardData } from "../../../../types/dashboard";

export const useAdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const res = await dashboardService.getAdminDashboard();
        setData(res.data);
      } catch {
        toast.error("Gagal memuat data dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return { data, isLoading };
};
