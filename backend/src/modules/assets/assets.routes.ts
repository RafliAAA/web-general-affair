import assetsController from "./assets.controller";
import express from "express";
import authMiddleware from "../../middleware/auth";

const router = express.Router()

router.post("/", authMiddleware.protectRoute, assetsController.createAsset)
router.get("/", authMiddleware.protectRoute, assetsController.getAllAssets)
router.get("/available", assetsController.getAvailableAssets)
router.get("/borrowed", assetsController.getBorrowedAssets)
router.get("/:asset_id", assetsController.getAssetById)
router.patch("/:asset_id", authMiddleware.protectRoute, assetsController.updateAsset)
router.delete("/:asset_id", authMiddleware.protectRoute, assetsController.deleteAsset)

export default router