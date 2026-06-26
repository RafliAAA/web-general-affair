import express from "express"
import authMiddleware from "../../middleware/auth"
import disposalController from "./disposal.controller"

const router = express.Router()

router.post("/", authMiddleware.protectRoute, disposalController.createDisposal)
router.get("/", authMiddleware.protectRoute, disposalController.getAllDisposals);
router.get("/:disposal_id", authMiddleware.protectRoute, disposalController.getDisposalById)
router.patch("/:disposal_id", authMiddleware.protectRoute, disposalController.updateDisposal)
router.delete("/:disposal_id", authMiddleware.protectRoute, disposalController.deleteDisposal)

export default router;