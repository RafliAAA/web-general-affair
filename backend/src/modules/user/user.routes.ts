import express from "express";
import userController from "./user.controller";
import authMIddleware from "../../middleware/auth";

const router = express.Router();


router.post("/", authMIddleware.protectRoute, userController.createUserByAdmin);
router.get("/", authMIddleware.protectRoute, userController.getAllUsers);
router.get("/:id", authMIddleware.protectRoute, userController.getUserById);
// router.put("/:id", authMIddleware.protectRoute, userController.updateUser);

export default router;
