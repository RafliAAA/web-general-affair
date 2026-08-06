import express from "express";
import entityController from "./entity.controller";
import authMiddleware from "../../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware.protectRoute, entityController.getAllEntities);
router.post("/", authMiddleware.protectRoute, entityController.createEntity);

router.patch(
  "/:id",
  authMiddleware.protectRoute,
  entityController.updateEntity,
);
router.delete(
  "/:id",
  authMiddleware.protectRoute,
  entityController.deleteEntity,
);

export default router;
