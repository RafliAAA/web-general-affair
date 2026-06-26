import express from "express"
import authMiddleware from "../../middleware/auth"
import maintenanceController from "./maintenance.controller"

const router = express.Router()

router.post("/", authMiddleware.protectRoute, maintenanceController.createMaintenance)
router.get("/", authMiddleware.protectRoute, maintenanceController.getAllMaintenance)
router.get("/me", authMiddleware.protectRoute, maintenanceController.getMyMaintenance)
router.get("/:maintenance_id", authMiddleware.protectRoute, maintenanceController.getMaintenanceById)
router.get(
  "/:maintenance_id/actualization",
  authMiddleware.protectRoute,
  maintenanceController.getActualizationForm,
);
router.patch("/:maintenance_id/verify", authMiddleware.protectRoute, maintenanceController.verifyMaintenance)
router.patch("/:maintenance_id/take", authMiddleware.protectRoute, maintenanceController.takeMaintenance)
router.patch("/:maintenance_id/complete", authMiddleware.protectRoute, maintenanceController.completeMaintenance)
router.patch("/:maintenance_id/cannot-repair", authMiddleware.protectRoute, maintenanceController.cannotRepair)

export default router