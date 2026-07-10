import api from "../../../lib/axios";
import type { Asset } from "../../../types/inventory";

export interface AssetParams {
  search?: string;
  status?: string;
  asset_type?: string;
  page?: number;
  limit?: number;
}

export interface AssetMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getAssets = async (params?: AssetParams) => {
  const res = await api.get("/assets", { params });
  return {
    data: res.data.data,
    meta: res.data.meta,
  };
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

export const getMyAssets = async (excludeMaintenance = false): Promise<Asset[]> => {
  const res = await api.get("/assets/me", {
    params: {
      excludeMaintenance
    }
  });
  return res.data.data;
};