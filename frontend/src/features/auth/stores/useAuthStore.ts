import { create } from "zustand";
import { toast } from "sonner";
import { isAxiosError } from "axios"; // import type guard dari axios utama
import type { AuthState, SignupPayload } from "../../../types/auth";
import {
  signupApi,
  loginApi,
  logoutApi,
  checkAuthApi,
} from "../services/authService";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }: SignupPayload) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      set({ loading: false });
      toast.error("Password do not match");
      return;
    }
    try {
      const user = await signupApi({ name, email, password, confirmPassword });
      set({ user, loading: false });
      toast.success("Registrasi berhasil!");
    } catch (error: unknown) {
      set({ loading: false });
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "An error occurred");
      } else {
        toast.error("Unexpected error");
      }
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const user = await loginApi({ email, password });
      set({ user, loading: false });
      toast.success("Login berhasil!");
    } catch (error: unknown) {
      set({ loading: false });
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "An error occurred during login",
        );
      } else {
        toast.error("Unexpected error");
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      await logoutApi();
      set({ user: null });
      toast.success("Logout berhasil!");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "An error occurred during logout",
        );
      } else {
        toast.error("Unexpected error");
      }
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const user = await checkAuthApi();
      set({ user, checkingAuth: false });
    } catch (error: unknown) {
      set({ user: null, checkingAuth: false });
      if (isAxiosError(error)) {
        console.error(error.response?.data?.message);
      } else {
        console.error("Unexpected error");
      }
    }
  },

  

 
}));
