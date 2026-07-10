import api from "../../../lib/axios";

export interface Facility {
  facility_id: string;
  room_id: string;
  name: string;
}

export interface Room {
  room_id: string;
  name: string;
  capacity: number;
  location: string;
  status: "Tersedia" | "Tidak Tersedia";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  facilities: Facility[];
}

export interface CreateRoomPayload {
  name: string;
  capacity: number;
  location: string;
  facilities: string[];
}

export const roomService = {
  getAll: async (): Promise<Room[]> => {
    const res = await api.get("/rooms");
    return res.data.data;
  },

  getById: async (id: string): Promise<Room> => {
    const res = await api.get(`/rooms/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateRoomPayload): Promise<Room> => {
    const res = await api.post("/rooms", payload);
    return res.data.data;
  },

  update: async (id: string, payload: Partial<CreateRoomPayload>): Promise<Room> => {
    const res = await api.patch(`/rooms/${id}`, payload);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/rooms/${id}`);
  },
};