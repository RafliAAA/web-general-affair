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
  asset: {
    asset_name: string;
    serial_number: string;
    asset_type: string;
  };
  user: {
    profile: {
      name: string;
    } | null;
  };
}

export const getBorrowRequests = async (): Promise<BorrowRequest[]> => {
  const res = await api.get("/borrow");
  return res.data.data;
};

export const approveBorrowRequest = async (borrow_id: string) => {
  const res = await api.patch(`/borrow/approve/${borrow_id}`);
  return res.data.data;
};

export const rejectBorrowRequest = async (borrow_id: string) => {
  const res = await api.patch(`/borrow/reject/${borrow_id}`);
  return res.data.data;
};
