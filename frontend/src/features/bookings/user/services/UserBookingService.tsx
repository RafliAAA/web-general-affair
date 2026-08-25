import api from "../../../../lib/axios";
import type { Booking, CreateBookingPayload } from "@/types/booking";

export const userBookingService = {
  // User melihat semua booking (untuk cek slot kalender yang sudah dibooking orang lain)
  getAll: async (): Promise<Booking[]> => {
    const res = await api.get("/bookings");
    return res.data.data;
  },

  // User melihat riwayat booking miliknya sendiri
  getMy: async (): Promise<Booking[]> => {
    const res = await api.get("/bookings/me");
    return res.data.data;
  },

  // User melihat detail booking
  getById: async (id: string): Promise<Booking> => {
    const res = await api.get(`/bookings/${id}`);
    return res.data.data;
  },

  // User mengajukan booking baru
  create: async (payload: CreateBookingPayload): Promise<Booking> => {
    const res = await api.post("/bookings", payload);
    return res.data.data;
  },

  // User membatalkan booking miliknya yang masih menunggu
  cancel: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}/cancel`);
  },
};
