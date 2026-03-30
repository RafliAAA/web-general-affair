import express from "express"
import authMiddleware from "../../middleware/auth";
import borrowController from "./borrow.controller";

const router = express.Router()

router.get("/", authMiddleware.protectRoute, borrowController.getAllBorrowRequest)
router.post("/:asset_id",  authMiddleware.protectRoute, borrowController.createBorrowRequest)
router.get("/:user_id", authMiddleware.protectRoute, borrowController.getBorrowRequestByUserId)
router.get("/me", authMiddleware.protectRoute, borrowController.getMyBorrows)
router.patch("/:borrow_id", authMiddleware.protectRoute, borrowController.cancelBorrowRequest)
router.patch("/approve/:borrow_id", authMiddleware.protectRoute, borrowController.approveBorrowRequest)

export default router