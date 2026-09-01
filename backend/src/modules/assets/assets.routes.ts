import assetsController from "./assets.controller";
import express from "express";
import authMiddleware from "../../middleware/auth";

const router = express.Router()

router.post("/", authMiddleware.protectRoute, assetsController.createAsset)
router.get("/", authMiddleware.protectRoute, assetsController.getAllAssets)
router.get(
  "/borrowable",
  authMiddleware.protectRoute,
  assetsController.getBorrowableAssets,
);
router.get("/categories", authMiddleware.protectRoute, assetsController.findAllCategories)
router.get("/categories/:asset_category_id", authMiddleware.protectRoute, assetsController.findCategoryById)
router.post("/categories", authMiddleware.protectRoute, assetsController.createCategory)
router.patch("/categories/:asset_category_id", authMiddleware.protectRoute, assetsController.updateCategory)
router.delete("/categories/:asset_category_id", authMiddleware.protectRoute, assetsController.deleteCategory)
router.get("/available", assetsController.getAvailableAssets)
router.get("/borrowed", assetsController.getBorrowedAssets)
router.get("/me", authMiddleware.protectRoute, assetsController.getMyAssets)
router.get("/:asset_id", assetsController.getAssetById)
router.patch("/:asset_id", authMiddleware.protectRoute, assetsController.updateAsset)
router.delete("/:asset_id", authMiddleware.protectRoute, assetsController.deleteAsset)


export default router
