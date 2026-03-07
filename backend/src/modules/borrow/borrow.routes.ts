import express from "express"
import authMiddleware from "../../middleware/auth";
import borrowController from "./borrow.controller";

const router = express.Router()

router.post("/",  authMiddleware.protectRoute, borrowController.createBorrowRequest)
router.get("/", authMiddleware.protectRoute, borrowController.getAllBorrowRequest)
router.get("/me", authMiddleware.protectRoute, borrowController.getBorrowRequestByUserId)
router.delete("/:borrow_id", authMiddleware.protectRoute, borrowController.cancelBorrowRequest)


export default router