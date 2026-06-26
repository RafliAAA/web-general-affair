import api from "../../../lib/axios";

export interface DisposalItem {
  disposal_item_id: string;
  disposal_id: string;
  asset_id: string;
  notes: string;
  method: string;
  asset: {
    asset_id: string;
    asset_code: string;
    serial_number: string;
    asset_name: string;
    asset_type: string;
    purchase_date: string;
    warranty_date: string | null;
    photo: string | null;
    status: string;
    condition: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}

export interface Disposal {
  disposal_id: string;
  memo_number: string;
  memo_date: string;
  subject: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  items?: DisposalItem[];
}

export interface DisposalItemPayload {
  asset_id: string;
  method: string;
  notes?: string;
}

export interface CreateDisposalPayload {
  memo_number: string;
  memo_date: string;
  subject: string;
  description: string;
  items: DisposalItemPayload[];
}

export const getDisposals = async (): Promise<Disposal[]> => {
  const res = await api.get("/disposal");
  return res.data.data;
};

export const getDisposalById = async (id: string): Promise<Disposal> => {
  const res = await api.get(`/disposal/${id}`);
  return res.data.data;
};

export const createDisposal = async (
  payload: CreateDisposalPayload,
): Promise<Disposal> => {
  const res = await api.post("/disposal", payload);
  return res.data.data;
};

export const updateDisposal = async (
  id: string,
  payload: Partial<CreateDisposalPayload>,
): Promise<Disposal> => {
  const res = await api.patch(`/disposal/${id}`, payload);
  return res.data.data;
};

export const deleteDisposal = async (id: string): Promise<void> => {
  await api.delete(`/disposal/${id}`);
};
