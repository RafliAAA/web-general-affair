import { useEffect, useState } from "react";
import { getBorrowedAssets, createReturn } from "../services/returnService";
import type {
  BorrowRequest,
  CreateReturnPayload,
} from "../services/returnService";
import { toast } from "sonner";

export const useReturn = () => {
  const [borrows, setBorrows] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBorrowedAssets()
      .then(setBorrows)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleReturn = async (payload: CreateReturnPayload) => {
    try {
      await createReturn(payload);

      setBorrows((prev) =>
        prev.filter((b) => b.borrow_id !== payload.borrow_id),
      );

      toast.success("Aset berhasil dikembalikan");
    } catch (error) {
      console.error("Failed to return asset", error);
      toast.error("Gagal mengembalikan aset");
    }
  };
  return { borrows, loading, error, handleReturn };
};
