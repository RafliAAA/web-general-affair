import express from "express";
import profileController from "./profile.controller";
import authMiddleware from "../../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware.protectRoute, profileController.getProfile);
router.patch("/", authMiddleware.protectRoute, profileController.updateProfile);

export default router;
