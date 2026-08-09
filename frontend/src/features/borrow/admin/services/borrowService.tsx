import api from "../../../../lib/axios";

export interface BorrowRequest {
  borrow_id: string;
  user_id: string;
  asset_id: string;
  borrow_reason: string;
  expected_return_date: string;
  status: "Menunggu" | "Disetujui" | "Ditolak" | "Dibatalkan" | "Dikembalikan";
  approved_by: string | null;
  createdAt: string;
  recipient_type?: "Personal" | "Divisi"; 

  asset: {
    asset_name: string;
    asset_code: string; 
    serial_number: string;
    asset_category?: { category_name: string } | null;
  };

  user: {
    profile: {
      name: string | null;
    } | null;
  } | null;

  approver?: {
    profile: {
      name: string | null;
    } | null;
  } | null;

  returns?: {
    return_id: string;
    return_condition: string;
    return_date: string;
    notes: string | null;
  }[];
}

export const getBorrowRequests = async (): Promise<BorrowRequest[]> => {
  const res = await api.get("/borrow");
  return res.data.data;
};

export const getBorrowById = async (id: string) => {
  const res = await api.get(`/borrow/${id}`);
  return res.data.data;
};

export const approveBorrowRequest = async (borrow_id: string) => {
  const res = await api.patch(`/borrow/${borrow_id}/approve/`);
  return res.data.data;
};

export const rejectBorrowRequest = async (borrow_id: string) => {
  const res = await api.patch(`/borrow/${borrow_id}/reject`);
  return res.data.data;
};
