import { setCookies } from "../../helper/cookies";
import authService from "./auth.service";
import { Request, Response } from "express";

const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.register(email, password);

    const { accessToken, refreshToken, user } = result;

    setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error as Error,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await authService.login(
      email,
      password,
    );

    setCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error as Error,
    });
  }
};

export default {
  register,
  login,
};
