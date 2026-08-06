import { Response } from "express";
import type { AuthRequest } from "../../middleware/auth";
import notificationService from "./notification.service";

const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;
    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await notificationService.getMyNotifications(user_id);
    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

const readNotification = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;
    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { notification_id } = req.params;
    if (!notification_id) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }

    const result = await notificationService.readNotification(
      notification_id,
      user_id,
    );
    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

const readAllNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;
    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await notificationService.readAllNotifications(user_id);
    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

export default {
  getNotifications,
  readNotification,
  readAllNotifications,
};
