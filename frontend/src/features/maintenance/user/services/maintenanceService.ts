import type { CreateMaintenancePayload, Maintenance } from "@/types/maintenance";
import api from "../../../../lib/axios";

export const getMyMaintenance = async (): Promise<Maintenance[]> => {
  const res = await api.get("/maintenance/me");
  return res.data.data;
};

export const getMaintenanceById = async (id: string): Promise<Maintenance> => {
  const res = await api.get(`/maintenance/${id}`);
  return res.data.data;
};

export const createMaintenance = async (
  payload: CreateMaintenancePayload,
): Promise<Maintenance> => {
  const res = await api.post("/maintenance", payload);
  return res.data.data;
};