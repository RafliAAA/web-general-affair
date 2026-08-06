import { Router } from "express";
import dashboardController from "./dashboard.controller";
import authMiddleware from "../../middleware/auth";

const router = Router();

router.get(
  "/admin",
  authMiddleware.protectRoute,
  dashboardController.getAdminDashboard,
);
router.get(
  "/me",
  authMiddleware.protectRoute,
  dashboardController.getUserDashboard,
);
router.get(
  "/it",
  authMiddleware.protectRoute,
  dashboardController.getITDashboard,
);

export default router;
