import { useEffect, useState } from "react";
import {
  getBorrowRequests,
  approveBorrowRequest,
  rejectBorrowRequest,
} from "../services/borrowService";
import type { BorrowRequest } from "../services/borrowService";
import { toast } from "sonner";

export const useBorrowAdmin = () => {
  const [borrows, setBorrows] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const data = await getBorrowRequests();
      setBorrows(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  const handleApprove = async (borrow_id: string) => {
    try {
      await approveBorrowRequest(borrow_id);

      setBorrows((prev) =>
        prev.map((b) =>
          b.borrow_id === borrow_id ? { ...b, status: "Disetujui" } : b,
        ),
      );

      toast.success("Peminjaman disetujui");
    } catch (error) {
      console.log("Failed to approve borrow request", error);
      toast.error("Gagal menyetujui permintaan");
    }
  };

  const handleReject = async (borrow_id: string) => {
    try {
      await rejectBorrowRequest(borrow_id);

      setBorrows((prev) =>
        prev.map((b) =>
          b.borrow_id === borrow_id ? { ...b, status: "Ditolak" } : b,
        ),
      );

      toast.success("Peminjaman ditolak");
    } catch (error) {
      console.log("Failed to reject borrow request", error);
      toast.error("Gagal menolak permintaan");
    }
  };

  return { borrows, loading, error, handleApprove, handleReject };
};
