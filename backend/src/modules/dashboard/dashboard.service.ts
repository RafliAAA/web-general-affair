import dashboardRepository from "./dashboard.repository";

const getAdminDashboard = async () => {
  const result = await dashboardRepository.getAdminDashboard();
  if (!result) throw new Error("Failed to fetch dashboard data");
  return result;
};

const getUserDashboard = async (user_id: string) => {
  const result = await dashboardRepository.getUserDashboard(user_id);
  if (!result) throw new Error("Failed to fetch user dashboard");
  return result;
};

const getITDashboard = async () => {
  const result = await dashboardRepository.getITDashboard();
  if (!result) throw new Error("Failed to fetch IT dashboard");
  return result;
};

export default { 
  getAdminDashboard,
  getUserDashboard,
  getITDashboard,
 };
