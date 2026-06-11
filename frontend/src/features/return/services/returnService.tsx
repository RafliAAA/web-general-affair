import api from "../../../lib/axios";
import type { BorrowRequest } from "../../borrow/admin/services/borrowService";

export type { BorrowRequest };

export interface CreateReturnPayload {
  borrow_id: string;
  return_condition: "Baik" | "Cukup" | "Rusak";
  notes?: string;
}

export const getBorrowedAssets = async (): Promise<BorrowRequest[]> => {
  const res = await api.get("/borrow/active");
  return res.data.data.filter(
    (b: BorrowRequest) => b.status === "Disetujui",
  );
};

export const createReturn = async (payload: CreateReturnPayload) => {
  const res = await api.post("/return", payload);
  return res.data.data;
};