import { useEffect, useState } from "react";
import {
  getAvailableAssets,
  createBorrowRequest,
} from "../services/borrowService";
import type { Asset } from "../../../../types/inventory";
import { toast } from "sonner";

export const useAvailableAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAvailableAssets()
      .then(setAssets)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleBorrowRequest = async (
    asset_id: string,
    borrow_date: string,
    borrow_reason: string,
    expected_return_date: string,
  ) => {
    try {
      const result = await createBorrowRequest(
        asset_id,
        borrow_date,
        borrow_reason,
        expected_return_date,
      );

      // optional: remove asset dari list available
      setAssets((prev) => prev.filter((a) => a.asset_id !== asset_id));

      toast.success("Permintaan peminjaman berhasil dikirim");

      return result;
    } catch (error) {
      console.log("Failed to create borrow request", error);
      toast.error("Gagal mengajukan peminjaman");
      throw error;
    }
  };

  return { assets, loading, error, handleBorrowRequest };
};
