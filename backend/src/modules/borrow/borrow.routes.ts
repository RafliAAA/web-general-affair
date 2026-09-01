import express from "express";
import authMiddleware from "../../middleware/auth";
import borrowController from "./borrow.controller";

const router = express.Router();

router.get("/", authMiddleware.protectRoute, borrowController.getAllBorrowRequest);
router.get("/active", authMiddleware.protectRoute, borrowController.getAllActiveBorrow);
router.get("/me", authMiddleware.protectRoute, borrowController.getMyBorrows);
router.post("/", authMiddleware.protectRoute, borrowController.createBorrowRequest);


router.get("/:borrow_id", authMiddleware.protectRoute, borrowController.getBorrowById);

router.patch("/:borrow_id/cancel", authMiddleware.protectRoute, borrowController.cancelBorrowRequest);
router.patch("/:borrow_id/approve", authMiddleware.protectRoute, borrowController.approveBorrowRequest);
router.patch("/:borrow_id/taken", authMiddleware.protectRoute, borrowController.markAsTaken);
router.patch("/:borrow_id/reject", authMiddleware.protectRoute, borrowController.rejectBorrowRequest);

export default router;