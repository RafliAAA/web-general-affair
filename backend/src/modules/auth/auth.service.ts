import authRepository from "./auth.repository";
import { generateTokens } from "../../helper/tokens";
import bcrypt from "bcrypt";

const register = async (email: string, password: string) => {
  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await authRepository.createUser({
    email,
    password: hashedPassword,
  });

  const { refreshToken, accessToken } = generateTokens(user);

  return {
    user: {
      user_id: user.user_id,
      email: user.email,
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
    },
    accessToken,
    refreshToken,
  };
};

export default {
  register,
  login,
};
