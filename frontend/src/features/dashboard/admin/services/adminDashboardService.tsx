import api from "../../../../lib/axios";
import type { DashboardResponse } from "../../../../types/dashboard";

export const dashboardService = {
  getAdminDashboard: async (): Promise<DashboardResponse> => {
    const res = await api.get<DashboardResponse>("/dashboard/admin");
    return res.data;
  },
};