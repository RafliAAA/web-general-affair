import express from "express"
import authMiddleware from "../../middleware/auth";
import borrowController from "./borrow.controller";

const router = express.Router()

router.get("/", authMiddleware.protectRoute, borrowController.getAllBorrowRequest)
router.get("/active", authMiddleware.protectRoute, borrowController.getAllActiveBorrow)
router.post("/",  authMiddleware.protectRoute, borrowController.createBorrowRequest)
router.get("/:user_id", authMiddleware.protectRoute, borrowController.getBorrowRequestByUserId)
router.get("/me", authMiddleware.protectRoute, borrowController.getMyBorrows)
router.patch("/:borrow_id", authMiddleware.protectRoute, borrowController.cancelBorrowRequest)
router.patch("/approve/:borrow_id", authMiddleware.protectRoute, borrowController.approveBorrowRequest)
router.patch("/reject/:borrow_id", authMiddleware.protectRoute, borrowController.rejectBorrowRequest)

export default router