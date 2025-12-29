import authService from "./auth.service";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.register(email, password);
    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error as Error,
    });
  }
};

export default {
    register
}
