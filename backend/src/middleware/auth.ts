import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import authRepository from "../modules/auth/auth.repository";

export interface AuthRequest extends Request {
  user?: {
    user_id: string;
    email: string;
  };
}

const protectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: true,
        message: "Unauthorized - No access token provided",
      });
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as {
      user_id: string;
      email: string;
    };

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid access token",
      });
    }

    const user = await authRepository.findUserById(decoded.user_id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not found",
      });
    }
    req.user = {
      user_id: user.user_id,
      email: user.email,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid access token",
    });
  }
};

export default {
  protectRoute,
};
