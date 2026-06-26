import type { CreateProcurementPayload, Procurement } from "@/types/procurement";
import api from "../../../lib/axios";



export const getProcurements = async (): Promise<Procurement[]> => {
  const res = await api.get("/procurement");
  return res.data.data;
};

export const getProcurementById = async (id: string): Promise<Procurement> => {
  const res = await api.get(`/procurement/${id}`);
  return res.data.data;
};

export const createProcurement = async (
  payload: CreateProcurementPayload,
): Promise<Procurement> => {
  const res = await api.post("/procurement", payload);
  return res.data.data;
};

export const updateProcurement = async (
  id: string,
  payload: Partial<CreateProcurementPayload>,
): Promise<Procurement> => {
  const res = await api.patch(`/procurement/${id}`, payload);
  return res.data.data;
};

export const deleteProcurement = async (id: string): Promise<void> => {
  await api.delete(`/procurement/${id}`);
};

export const exportProcurementPDF = async (id: string): Promise<string> => {
  const res = await api.get(`/procurement/${id}/export`);
  return res.data.data.url;
};