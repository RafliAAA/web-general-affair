import api from "../../../lib/axios";
import type { Asset } from "../../../types/inventory";

export const getAssets = async () => {
  const res = await api.get("/assets");
  return res.data.data;
};

export const createAsset = async (data: Asset) => {
  const res = await api.post("/assets", data);
  return res.data.data;
};

export const updateAsset = async (id: string, data: Partial<Asset>) => {
  const res = await api.patch(`/assets/${id}`, data);
  return res.data.data;
};

export const deleteAsset = async (id: string) => {
  const res = await api.delete(`/assets/${id}`);
  return res.data.data;
};

export const getAssetById = async (id: string) => {
  const res = await api.get(`/assets/${id}`);
  return res.data.data;
};