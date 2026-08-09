import { useEffect, useState, useCallback } from "react";
import {
  getAvailableAssets,
  getMyBorrows,
  createBorrowRequest,
} from "../services/borrowService";
import type { Asset, Borrow } from "../../../../types/inventory";
import { toast } from "sonner";

export const useAvailableAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TAMBAHKAN STATE UNTUK PEMINJAMAN SAYA
  const [myBorrows, setMyBorrows] = useState<Borrow[]>([]);
  const [loadingBorrows, setLoadingBorrows] = useState(true);

  // Fungsi untuk fetch ulang peminjaman saya
  const fetchMyBorrows = useCallback(async () => {
    try {
      setLoadingBorrows(true);
      const data = await getMyBorrows();
      setMyBorrows(data);
    } catch (err) {
      console.error("Gagal fetch peminjaman saya:", err);
    } finally {
      setLoadingBorrows(false);
    }
  }, []);

  useEffect(() => {
    // Fetch available assets
    getAvailableAssets()
      .then(setAssets)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    // Fetch my borrows
    fetchMyBorrows();
  }, [fetchMyBorrows]);

  const handleBorrowRequest = async (
    asset_id: string,
    borrow_date: string,
    borrow_reason: string,
    expected_return_date: string,
    recipient_type: "Personal" | "Divisi",
  ) => {
    try {
      const result = await createBorrowRequest(
        asset_id,
        borrow_date,
        borrow_reason,
        expected_return_date,
        recipient_type,
      );

      // Hapus aset dari list available agar gak dobel pinjam
      setAssets((prev) => prev.filter((a) => a.asset_id !== asset_id));

      // Refresh list peminjaman saya agar langsung muncul di tabel
      fetchMyBorrows();

      toast.success("Permintaan peminjaman berhasil dikirim");
      return result;
    } catch (error) {
      console.log("Failed to create borrow request", error);
      toast.error("Gagal mengajukan peminjaman");
      throw error;
    }
  };

  return {
    assets,
    loading,
    error,
    handleBorrowRequest,
    myBorrows,
    loadingBorrows,
    fetchMyBorrows,
  };
};
