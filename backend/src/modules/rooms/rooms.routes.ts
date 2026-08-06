import express from "express";
import authMiddleware from "../../middleware/auth";
import roomController from "./rooms.controller";

const router = express.Router();

// ─── Room ─────────────────────────────────────────────────────────────────────
router.get("/", authMiddleware.protectRoute, roomController.getAllRooms);
router.get("/:room_id", authMiddleware.protectRoute, roomController.getRoomById);
router.get(
  "/:room_id/schedule",
  authMiddleware.protectRoute,
  roomController.getRoomSchedule,
);
router.post("/", authMiddleware.protectRoute, roomController.createRoom);
router.patch(
  "/:room_id",
  authMiddleware.protectRoute,
  roomController.updateRoom,
);
router.delete(
  "/:room_id",
  authMiddleware.protectRoute,
  roomController.deleteRoom,
);

export default router;
