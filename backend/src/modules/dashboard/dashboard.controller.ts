import { Request, Response } from "express";
import dashboardService from "./dashboard.service";
import { AuthRequest } from "../../middleware/auth";

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

const getUserDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;
    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await dashboardService.getUserDashboard(user_id);
    return res.status(200).json({
      success: true,
      message: "User dashboard fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user dashboard",
      error: error.message,
    });
  }
};

const getITDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const result = await dashboardService.getITDashboard();
    return res.status(200).json({
      success: true,
      message: "IT dashboard fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch IT dashboard",
      error: error.message,
    });
  }
};

export default {
  getAdminDashboard,
  getUserDashboard, 
  getITDashboard,
}