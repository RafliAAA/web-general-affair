import express from "express";
import handoverController from "./handover.controller";
import authMiddleware from "../../middleware/auth";

const router = express.Router();

router.post(
  "/",
  authMiddleware.protectRoute,
  handoverController.createHandover,
);
router.get("/", authMiddleware.protectRoute, handoverController.getAllHandover);
router.get(
  "/:handover_id",
  authMiddleware.protectRoute,
  handoverController.getHandoverById,
);
router.patch(
  "/:handover_id/return",
  authMiddleware.protectRoute,
  handoverController.returnHandover,
);

router.get(
  "/my",
  authMiddleware.protectRoute,
  handoverController.getMyHandover,
);

export default router;
