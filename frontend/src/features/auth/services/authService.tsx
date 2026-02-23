import api from "../../../lib/axios";
import type { SignupPayload, LoginPayload, User } from "../../../types/auth";

export const signupApi = async (payload: SignupPayload): Promise<User> => {
  const res = await api.post("/auth/register", payload);
  return res.data.user;
};

export const loginApi = async (payload: LoginPayload): Promise<User> => {
  const res = await api.post("/auth/login", payload);
  return res.data.data;
};

export const logoutApi = async (): Promise<void> => {
  await api.delete("/auth/logout");
};

export const checkAuthApi = async (): Promise<User> => {
  const res = await api.get("/auth/me");
  return res.data.data.profile;
};
