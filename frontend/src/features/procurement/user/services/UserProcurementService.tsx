import api from "@/lib/axios";
import type {
  Procurement,
  CreateProcurementPayload,
} from "@/types/procurement";

export const userProcurementService = {
  getMyProcurements: async (): Promise<Procurement[]> => {
    const res = await api.get("/procurement");
    return res.data.data || [];
  },

  createProcurement: async (
    payload: CreateProcurementPayload,
  ): Promise<Procurement> => {
    const res = await api.post("/procurement", payload);
    return res.data.data;
  },
};
