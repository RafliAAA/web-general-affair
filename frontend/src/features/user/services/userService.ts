import api from "../../../lib/axios";

export interface Entity {
  entity_id: string;
  entity_name: string;
}

export interface Directorate {
  directorate_id: string;
  directorate_name: string;
}

export interface UserProfile {
  profile_id: string;
  name: string | null;
  photo: string | null;
  entity_id: string | null;
  directorate_id: string | null;
  entity?: Entity | null;
  directorate?: Directorate | null;
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
  entity_id: string;
  directorate_id: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: "USER" | "ADMIN" | "IT";
  photo?: string | null;
  entity_id?: string;
  directorate_id?: string;
}

export const userService = {
  getAll: async (): Promise<User[]> => {
    const res = await api.get("/users");
    return res.data.data;
  },

  search: async (search: string): Promise<User[]> => {
    const res = await api.get("/users", {
      params: { search },
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

  update: async (id: string, payload: UpdateUserPayload): Promise<User> => {
    const res = await api.patch(`/users/${id}`, payload);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
