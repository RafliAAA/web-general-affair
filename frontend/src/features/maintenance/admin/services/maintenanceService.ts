import api from "@/lib/axios";
import type { Maintenance } from "@/types/maintenance";

export const verifyMaintenance = async (
  maintenance_id: string,
): Promise<Maintenance> => {
  const res = await api.patch(`/maintenance/${maintenance_id}/verify`);
  return res.data.data;
};

export const rejectMaintenance = async (
  maintenance_id: string,
  rejection_reason: string,
): Promise<Maintenance> => {
  const res = await api.patch(`/maintenance/${maintenance_id}/reject`, {
    rejection_reason,
  });
  return res.data.data;
};

export const getAllMaintenance = async (): Promise<Maintenance[]> => {
  const res = await api.get("/maintenance");
  return res.data.data;
};
