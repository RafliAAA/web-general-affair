import express from "express";
import authController from "./auth.controller";
import authMiddleware from "../../middleware/auth";

const router = express.Router();

router.post("/register", authController.register, authMiddleware.protectRoute);
router.post("/login", authController.login, authMiddleware.protectRoute);

export default router;
