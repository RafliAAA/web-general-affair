export interface Entity {
  entity_id: string;
  entity_name: string;
}

export interface Directorate {
  directorate_id: string;
  directorate_name: string;
  entity_id: string;
}

export interface HandoverAsset {
  asset_id: string;
  asset_code: string;
  serial_number?: string;
  asset_name: string;
  asset_category?: {       
    category_name: string;
  } | null
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
  returned_at: string | null;
  return_notes: string
  notes: string;
  asset: HandoverAsset;
  handover: Handover;
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
  entity: Entity;       
  directorate: Directorate; 
  // TAMBAHKAN INI
  recipient_type: "Personal" | "Divisi";
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
  entity_id: string;       
  directorate_id: string;  
  // TAMBAHKAN INI
  recipient_type: "Personal" | "Divisi";
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