import api from "../../../../lib/axios";
import type {
  HandoverListResponse,
  HandoverResponse,
  CreateHandoverPayload,
  ReturnHandoverPayload,
} from "../../../../types/handover";

export const adminHandoverService = {
  getAll: async (): Promise<HandoverListResponse> => {
    const res = await api.get<HandoverListResponse>("/handover");
    return res.data;
  },

  getById: async (id: string): Promise<HandoverResponse> => {
    const res = await api.get<HandoverResponse>(`/handover/${id}`);
    return res.data;
  },

  create: async (payload: CreateHandoverPayload): Promise<HandoverResponse> => {
    const res = await api.post<HandoverResponse>("/handover", payload);
    return res.data;
  },

  returnHandover: async (
    id: string,
    payload: ReturnHandoverPayload,
  ): Promise<HandoverResponse> => {
    const res = await api.patch<HandoverResponse>(
      `/handover/${id}/return`,
      payload,
    );
    return res.data;
  },

  delete: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/handover/${id}`);
    return res.data;
  },
};

export interface Asset {
  asset_id: string;
  asset_code: string;
  serial_number: string;
  asset_name: string;
  asset_type: string;
  purchase_date: string;
  warranty_date: string;
  photo: string | null;
  status: string;
  condition: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AssetListResponse {
  success: boolean;
  message: string;
  data: Asset[];
}

export const assetService = {
  getAll: async (): Promise<AssetListResponse> => {
    const res = await api.get<AssetListResponse>("/assets");
    return res.data;
  },
};