import { Request, Response } from "express";
import { CreateUserByAdminSchema } from "./user.dto";
import userService from "./user.service";

const createUserByAdmin = async (req: Request, res: Response) => {
  try {
    const validatedData = CreateUserByAdminSchema.parse(req.body);
    const result = await userService.createUserByAdmin(validatedData);

    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(error.name === "ZodError" ? 400 : 400).json({
      success: false,
      message: error.errors ? error.errors : error.message,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    if(!user_id) {
        return res.status(400).json({
            success:false,
            message: "User ID is required"
        })
    }
    const result = await userService.getUserById(user_id);

    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    const statusCode = error.message === "User not found" ? 404 : 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

// const updateUser = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const validatedData = UpdateUserSchema.parse(req.body);
//     const result = await userService.updateUser(id, validatedData);

//     res.status(200).json({ success: true, data: result });
//   } catch (error: any) {
//     const statusCode = error.message === "User not found" ? 404 : 400;
//     res.status(statusCode).json({
//       success: false,
//       message: error.errors ? error.errors : error.message,
//     });
//   }
// };

export default {
  createUserByAdmin,
  getAllUsers,
  getUserById,
//   updateUser,
};
