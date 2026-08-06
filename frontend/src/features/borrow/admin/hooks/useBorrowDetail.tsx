import { useState, useEffect } from "react";
import { getBorrowById } from "../services/borrowService";
// Import tipe data BorrowRequest dari service kamu
import type { BorrowRequest } from "../services/borrowService";

export const useBorrowDetail = (id: string | undefined) => {
  // Ganti any dengan BorrowRequest | null
  const [borrow, setBorrow] = useState<BorrowRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBorrow = async () => {
      setLoading(true);
      try {
        const data = await getBorrowById(id);
        setBorrow(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrow();
  }, [id]);

  return { borrow, loading, error };
};
