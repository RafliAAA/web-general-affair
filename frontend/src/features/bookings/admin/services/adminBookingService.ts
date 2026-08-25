import api from "../../../../lib/axios";
import type { Booking, ReviewBookingPayload } from "@/types/booking";

export const adminBookingService = {
  getAll: async (): Promise<Booking[]> => {
    const res = await api.get("/bookings");
    return res.data.data;
  },

  getById: async (id: string): Promise<Booking> => {
    const res = await api.get(`/bookings/${id}`);
    return res.data.data;
  },

  review: async (
    id: string,
    payload: ReviewBookingPayload,
  ): Promise<Booking> => {
    const res = await api.patch(`/bookings/${id}/review`, payload);
    return res.data.data;
  },
};
