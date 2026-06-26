import type {
  ActualizationForm,
  CannotRepairPayload,
  Maintenance,
} from "@/types/maintenance";
import api from "../../../../lib/axios";

export const getAllMaintenance = async (): Promise<Maintenance[]> => {
  const res = await api.get("/maintenance");
  return res.data.data;
};

export const takeMaintenance = async (
  maintenance_id: string,
): Promise<Maintenance> => {
  const res = await api.patch(`/maintenance/${maintenance_id}/take`);
  return res.data.data;
};

export const completeMaintenance = async (
  maintenance_id: string,
  resolution_notes: string,
): Promise<Maintenance> => {
  const res = await api.patch(`/maintenance/${maintenance_id}/complete`, {
    resolution_notes,
  });
  return res.data.data;
};

export const cannotRepairMaintenance = async (
  maintenance_id: string,
  payload: CannotRepairPayload,
): Promise<Maintenance> => {
  const res = await api.patch(
    `/maintenance/${maintenance_id}/cannot-repair`,
    payload,
  );
  return res.data.data;
};

export const getActualizationForm = async (
  maintenance_id: string,
): Promise<ActualizationForm> => {
  const res = await api.get(`/maintenance/${maintenance_id}/actualization`);
  return res.data.data;
};

export const getMaintenanceById = async (id: string): Promise<Maintenance> => {
  const res = await api.get(`/maintenance/${id}`);
  return res.data.data;
};