import api from "@/lib/axios";

export interface Entity {
  entity_id: string;
  entity_name: string;
  directorates?: any[]; 
}

export const getEntities = async (): Promise<Entity[]> => {
  const res = await api.get("/entity");
  return res.data.data;
};

export const createEntity = async (data: {
  entity_name: string;
}): Promise<Entity> => {
  const res = await api.post("/entity", data);
  return res.data.data;
};

export const updateEntity = async (
  id: string,
  data: { entity_name: string },
): Promise<Entity> => {
  const res = await api.patch(`/entity/${id}`, data);
  return res.data.data;
};

export const deleteEntity = async (id: string): Promise<void> => {
  await api.delete(`/entity/${id}`);
};
