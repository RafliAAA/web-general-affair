import { Router } from "express";
import dashboardController from "./dashboard.controller";
import authMiddleware from "../../middleware/auth";

const router = Router();

router.get(
  "/admin",
  authMiddleware.protectRoute,
  dashboardController.getAdminDashboard,
);

export default router;
