export type ProcurementStatus = "Menunggu" | "Disetujui" | "Ditolak";

export interface ProcurementItem {
  procurement_item_id: string;
  procurement_id: string;
  part_number: string;
  description: string;
  quantity: number;
  quantity_approved: number; // Tambahan: defaultnya 0 saat baru dibuat
  unit_of_measure: string;
}

export interface Procurement {
  procurement_id: string;
  pr_number: string;
  pr_date: string; // ISO String dari Date
  due_date: string; // ISO String dari Date
  end_user: string;
  remarks: string | null;
  status: ProcurementStatus; // Tambahan: untuk tracking status approval
  createdAt: string;
  updatedAt: string;
  items?: ProcurementItem[];
}

// Payload saat pertama kali membuat pengadaan (Create)
export interface CreateProcurementPayload {
  pr_number: string;
  pr_date: string;
  due_date: string;
  end_user: string;
  remarks: string | null;
  items: {
    part_number: string;
    description: string;
    quantity: number;
    unit_of_measure: string;
    // quantity_approved tidak perlu dikirim di sini karena otomatis 0 di backend
  }[];
}

// Tambahan: Payload saat melakukan Approval (Update oleh Admin/Keuangan)
export interface UpdateProcurementPayload {
  status: "Disetujui" | "Ditolak";
  remarks?: string | null;
  items: {
    procurement_item_id: string; // Butuh ID item untuk tahu item mana yang di-approve
    quantity_approved: number;   // Jumlah fisik yang disetujui untuk jadi aset
  }[];
}