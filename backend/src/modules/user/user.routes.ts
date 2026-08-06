import express from "express";
import userController from "./user.controller";
import authMIddleware from "../../middleware/auth";

const router = express.Router();


router.post("/", authMIddleware.protectRoute, userController.createUserByAdmin);
router.get("/", authMIddleware.protectRoute, userController.getAllUsers);
router.get("/:user_id", authMIddleware.protectRoute, userController.getUserById);
router.patch("/:user_id", authMIddleware.protectRoute, userController.updateUser);
router.delete("/:user_id", authMIddleware.protectRoute, userController.deleteUser);

export default router;
