import express from "express"
import procurementController from "./procurement.controller";
import authMiddleware from "../../middleware/auth";

const router = express.Router()

router.get("/", authMiddleware.protectRoute, procurementController.getAllProcurements)
router.get("/:procurement_id", authMiddleware.protectRoute, procurementController.getProcurementById)
router.post("/", authMiddleware.protectRoute, procurementController.createProcurement)
router.patch("/:procurement_id", authMiddleware.protectRoute, procurementController.updateProcurement)
router.delete("/:procurement_id", authMiddleware.protectRoute, procurementController.deleteProcurement)

export default router