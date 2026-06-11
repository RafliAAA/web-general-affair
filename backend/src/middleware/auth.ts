import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import authRepository from "../modules/auth/auth.repository";

interface User {
  user_id: string;
  email: string;
  role?: string;
}

export interface AuthRequest extends Request {
  user?: User;
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
        success: false,
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
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid access token",
    });
  }
};

const adminRoute = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied - admin only",
    });
  }
};

export default {
  protectRoute,
  adminRoute,
};
