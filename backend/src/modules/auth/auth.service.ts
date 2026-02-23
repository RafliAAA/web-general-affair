import authRepository from "./auth.repository";
import { generateTokens } from "../../helper/tokens";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

const register = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  const existingUser = await authRepository.findUserByEmail(data.email);

  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await authRepository.createUser({
    email: data.email,
    password: hashedPassword,
    profile: {
      create: {
      name: data.name,
      }
    },
  });

  const { refreshToken, accessToken } = generateTokens(user);

  return {
    user: {
      email: data.email,
      name: data.name || null,
    },
    accessToken,
    refreshToken,
  };
};

const login = async (email: string, password: string) => {
  const user = await authRepository.findUserByEmail(email);
  if (!user) throw new Error("Email not found");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Email or password incorrect");

  const { accessToken, refreshToken } = generateTokens(user);

  return {
    user: {
      id: user.user_id,
      email: user.email,
      name: user.profile?.name || null,
    },
    accessToken,
    refreshToken,
  };
};

const logout = async (user_id: string) => {
  return {
    message: "Logout successful",
  }
}

const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) throw new Error("No refresh token provided");

  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("Missing JWT secret(s) in environment variables");
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  ) as JwtPayload;

  const accessToken = jwt.sign(
    { user_id: decoded.user_id, email: decoded.email }, // konsisten dengan generateTokens
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  return accessToken;

};

const getProfile = async (user_id: string) => {
  const user = await authRepository.findUserById(user_id);

  if (!user) throw new Error("User not found");

  const { password, ...safeUser } = user;
  return safeUser;
};

export default {
  register,
  login,
  logout,
  refreshAccessToken,
  getProfile
};
