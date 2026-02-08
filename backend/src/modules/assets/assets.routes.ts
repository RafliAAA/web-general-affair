import assetsController from "./assets.controller";
import express from "express";

const router = express.Router()

router.post("/", assetsController.createAsset)
router.get("/", assetsController.getAllAssets)
router.get("/available", assetsController.getAvailableAssets)
router.get("/borrowed", assetsController.getBorrowedAssets)
router.get("/:asset_id", assetsController.getAssetById)
router.patch("/:asset_id", assetsController.updateAsset)
router.delete("/:asset_id", assetsController.deleteAsset)

export default router