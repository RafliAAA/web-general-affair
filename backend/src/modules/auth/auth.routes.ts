import express from "express";
import authController from "./auth.controller";
import authMiddleware from "../../middleware/auth";

const router = express.Router();

router.post("/register", authController.register, authMiddleware.protectRoute);
router.post("/login", authController.login, authMiddleware.protectRoute);
router.delete("/logout", authController.logout);
router.post("/refresh-token", authController.refreshAccessToken);
router.get("/me", authMiddleware.protectRoute, authController.getProfile);

export default router;
