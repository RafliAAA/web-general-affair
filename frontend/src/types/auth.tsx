export interface User {
  id: string;
  name: string;
  email: string;
  role?: string; // optional, kalau ada role
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  checkingAuth: boolean;
  signup: (data: SignupPayload) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forceLogout: () => void;
  checkAuth: () => Promise<void>;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}
