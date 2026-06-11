import api from "../../../lib/axios";
import type { Asset } from "../../../types/inventory";

export const getAvailableAssets = async (): Promise<Asset[]> => {
  const res = await api.get("/assets/available");
  return res.data.data;
};

export const createBorrowRequest = async (
  asset_id: string,
  borrow_reason: string,
  expected_return_date: string,
) => {
  const res = await api.post("/borrow", { asset_id, borrow_reason, expected_return_date });
  return res.data.data;
};
