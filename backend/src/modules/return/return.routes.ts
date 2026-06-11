import returnController from "./return.controller"
import express from "express"
import authMiddleware from "../../middleware/auth"

const router = express.Router()

router.post("/", authMiddleware.protectRoute, returnController.createReturn)

export default router