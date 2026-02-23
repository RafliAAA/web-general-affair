import { setCookies } from "../../helper/cookies";
import authService from "./auth.service";
import { Request, Response } from "express";

const register = async (req: Request, res: Response) => {
  try {
    const { email, password, nama } = req.body;

    const result = await authService.register({ email, password, nama });

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
      message: error instanceof Error ? error.message : "Unknown error",
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
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = await authService.refreshAccessToken(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({
      message: "Token refreshed successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    await authService.logout(refreshToken);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({
      success: true,
      message: "Logged Out successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfile = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user.user_id;

    const profile = await authService.getProfile(user_id);
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: profile,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to fetched profile",
      error: error.message,
    });
  }
};


export default {
  register,
  login,
  logout,
  refreshAccessToken,
  getProfile
};
