import { Request, Response } from "express";
import { CreateUserByAdminSchema, UpdateUserSchema } from "./user.dto";
import userService from "./user.service";
import { AuthRequest } from "../../middleware/auth";

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
    const search = req.query.search as string | undefined;


    const result = await userService.getAllUsers(search);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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

const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      })
    }
    
    const parsed = UpdateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const result = await userService.updateUser(user_id, parsed.data);
    
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

const deleteUser = async(req: Request, res: Response) => {
  try {
    const { user_id } = req.params

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      })
    }

    const result = await userService.deleteUser(user_id) 

    return res.status(200).json({
      success: true,
      message: "User successfully deleted",
      data: result,

    })
  } catch (error:any) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user ID",
      error: error.message
    })
  }
}

export default {
  createUserByAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
