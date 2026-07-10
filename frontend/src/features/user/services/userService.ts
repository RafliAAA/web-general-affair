import api from "../../../lib/axios";

export interface UserProfile {
  profile_id: string;
  name: string | null;
  foto_profil: string | null;
}

export interface User {
  user_id: string;
  email: string;
  role: "USER" | "ADMIN" | "IT";
  createdAt: string;
  updatedAt: string;
  profile: UserProfile | null;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN" | "IT";
}

export const userService = {
  getAll: async (): Promise<User[]> => {
    const res = await api.get("/users");
    return res.data.data;
  },

   search: async (search: string): Promise<User[]> => {
    const res = await api.get("/users", {
      params: {
        search,
      },
    });

    return res.data.data;
  },

  getById: async (id: string): Promise<User> => {
    const res = await api.get(`/users/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateUserPayload): Promise<User> => {
    const res = await api.post("/users", payload);
    return res.data.data;
  },
};