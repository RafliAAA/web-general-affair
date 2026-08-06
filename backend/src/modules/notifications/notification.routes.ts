import express from "express";
import notificationController from "./notification.controller";
import authMiddleware from "../../middleware/auth";

const router = express.Router();

router.get(
  "/",
  authMiddleware.protectRoute,
  notificationController.getNotifications,
);

router.patch(
  "/read-all",
  authMiddleware.protectRoute,
  notificationController.readAllNotifications,
);

router.patch(
  "/:notification_id/read",
  authMiddleware.protectRoute,
  notificationController.readNotification,
);

export default router;
