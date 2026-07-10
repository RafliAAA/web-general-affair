import { Request, Response } from "express";
import dashboardService from "./dashboard.service";

const getAdminDashboard = async (req: Request, res: Response) => {
  try {
    const result = await dashboardService.getAdminDashboard();
    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};

export default { getAdminDashboard };
