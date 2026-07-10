import api from "../../../lib/axios";

export interface BookingRoom {
  room_id: string;
  name: string;
  capacity: number;
  location: string;
  status: string;
  facilities: { facility_id: string; room_id: string; name: string }[];
}

export interface Booking {
  booking_id: string;
  room_id: string;
  user_id: string;
  reviewed_by: string | null;
  purpose: string;
  date: string;
  start_time: string;
  end_time: string;
  status: "Menunggu" | "Disetujui" | "Ditolak" | "Dibatalkan";
  reject_notes: string | null;
  createdAt: string;
  updatedAt: string;
  room: BookingRoom;
  user: { profile: { name: string } };
  reviewer: { profile: { name: string } } | null;
}

export interface CreateBookingPayload {
  room_id: string;
  purpose: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface ReviewBookingPayload {
  status: "Disetujui" | "Ditolak";
  reject_notes?: string;
}

export const bookingService = {
  getAll: async (): Promise<Booking[]> => {
    const res = await api.get("/bookings");
    return res.data.data;
  },

  getMy: async (): Promise<Booking[]> => {
    const res = await api.get("/bookings/my");
    return res.data.data;
  },

  getById: async (id: string): Promise<Booking> => {
    const res = await api.get(`/bookings/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateBookingPayload): Promise<Booking> => {
    const res = await api.post("/bookings", payload);
    return res.data.data;
  },

  review: async (
    id: string,
    payload: ReviewBookingPayload,
  ): Promise<Booking> => {
    const res = await api.patch(`/bookings/${id}/review`, payload);
    return res.data.data;
  },

  cancel: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}/cancel`);
  },
};
