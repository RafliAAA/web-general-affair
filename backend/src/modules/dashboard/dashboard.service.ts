import dashboardRepository from "./dashboard.repository";

const getAdminDashboard = async () => {
  const result = await dashboardRepository.getAdminDashboard();
  if (!result) throw new Error("Failed to fetch dashboard data");
  return result;
};

export default { getAdminDashboard };
