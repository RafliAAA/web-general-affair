import api from "@/lib/axios";
import type { Entity } from "../../entity/services/entityService";

export interface Directorate {
  directorate_id: string;
  directorate_name: string;
  entity_id: string;
  entity?: Entity;
}

export const getDirectorates = async (
  entity_id?: string,
): Promise<Directorate[]> => {
  const res = await api.get("/directorate", {
    params: entity_id ? { entity_id } : {},
  });
  return res.data.data;
};

export const createDirectorate = async (data: {
  directorate_name: string;
  entity_id: string;
}): Promise<Directorate> => {
  const res = await api.post("/directorate", data);
  return res.data.data;
};

export const updateDirectorate = async (
  id: string,
  data: { directorate_name: string; entity_id: string },
): Promise<Directorate> => {
  const res = await api.patch(`/directorate/${id}`, data);
  return res.data.data;
};

export const deleteDirectorate = async (id: string): Promise<void> => {
  await api.delete(`/directorate/${id}`);
};
