export interface User {
  id: string;
  name: string;
  email: string;
  role?: string; 
  profile: UserProfile | null
}

export interface UserProfile {
  name: string | null;
  photo: string | null;
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
  updateUser: (userData: User) => void;
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
