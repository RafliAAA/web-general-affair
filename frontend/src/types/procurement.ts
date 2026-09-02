export type ProcurementStatus = "Menunggu" | "Disetujui" | "Ditolak";

export interface ProcurementAsset {
  asset_id: string;
  asset_code: string;
  asset_name: string;
  status: string;
  condition: string;
  asset_category?: { category_name: string } | null; 
}

export interface ProcurementItem {
  procurement_item_id: string;
  procurement_id: string;
  part_number: string;
  description: string;
  quantity: number;
  quantity_approved: number;
  unit_of_measure: string;
  asset_category_id?: string;
  asset_category?: { category_name: string } | null;
  assets?: ProcurementAsset[]
}

export interface Procurement {
  procurement_id: string;
  pr_number: string;
  pr_date: string;
  due_date: string;
  end_user: string;
  remarks: string | null;
  status: ProcurementStatus;
  createdAt: string;
  updatedAt: string;
  items: ProcurementItem[];
  actualization?: {
    actualization_id: string;
    form_number: string;
    user_name: string;
    form_date: string;
    duration_minutes: number;
    description: string;
    issue: string;
    handling: string;
    recommendation: string;
  } | null;
}

export interface CreateProcurementPayload {
  pr_date: string;
  due_date: string;
  end_user: string;
  remarks: string | null;
  actualization_id?: string;
  items: {
    part_number: string;
    description: string;
    quantity: number;
    unit_of_measure: string;
  }[];
}

// Tambahan: Payload saat melakukan Approval (Update oleh Admin/Keuangan)
export interface UpdateProcurementPayload {
  pr_date: string;
  due_date: string;
  end_user: string;
  remarks: string | null;
  status: ProcurementStatus;
  items: ProcurementItem[]; // Kirim full item agar dapat asset_category_id
}