export interface HandoverAsset {
  asset_id: string;
  asset_code: string;
  serial_number?: string;
  asset_name: string;
  asset_type: string;
  purchase_date?: string;
  warranty_date?: string;
  photo?: string | null;
  status?: string;
  condition?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface HandoverItem {
  handover_item_id: string;
  handover_id: string;
  asset_id: string;
  notes: string;
  asset: HandoverAsset;
}

export interface HandoverProfile {
  profile: {
    name: string;
  };
}

export interface Handover {
  handover_id: string;
  user_id: string;
  created_by: string;
  handover_date: string;
  entity: string;
  directorate: string;
  status: "Aktif" | "Dikembalikan";
  returned_at: string | null;
  return_notes: string | null;
  returned_by: string | null;
  createdAt: string;
  updatedAt: string;
  items: HandoverItem[];
  receiver: HandoverProfile;
  creator: HandoverProfile;
  returner?: HandoverProfile | null;
}

export interface CreateHandoverItemPayload {
  asset_id: string;
  notes: string;
}

export interface CreateHandoverPayload {
  user_id: string;
  handover_date: string;
  entity: string;
  directorate: string;
  items: CreateHandoverItemPayload[];
}

export interface ReturnHandoverPayload {
  return_notes: string;
}

export interface HandoverResponse {
  success: boolean;
  message: string;
  data: Handover;
}

export interface HandoverListResponse {
  success: boolean;
  message: string;
  data: Handover[];
}
