import express from "express";
import directorateController from "./directorate.controller";
import authMiddleware from "../../middleware/auth";

const router = express.Router();

router.get(
  "/",
  authMiddleware.protectRoute,
  directorateController.getAllDirectorates,
);
router.post(
  "/",
  authMiddleware.protectRoute,
  directorateController.createDirectorate,
);

router.patch(
  "/:id",
  authMiddleware.protectRoute,
  directorateController.updateDirectorate,
);
router.delete(
  "/:id",
  authMiddleware.protectRoute,
  directorateController.deleteDirectorate,
);

export default router;
