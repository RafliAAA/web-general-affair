import { AuthRequest } from "../../middleware/auth";
import { Response } from "express";
import returnService from "./return.service";

const createReturn = async (req: AuthRequest, res: Response) => {
    try {
        const user_id = req.user?.user_id

        const { borrow_id, return_condition, notes } = req.body;

        const result = await returnService.createReturn({
            borrow_id,
            return_condition,
            approved_by: user_id!,
            notes,
        });

        return res.status(201).json({
            success: true,
            message: "Return created successfully",
            data: result
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to create return"
        })
    }
}

export default {
    createReturn
}