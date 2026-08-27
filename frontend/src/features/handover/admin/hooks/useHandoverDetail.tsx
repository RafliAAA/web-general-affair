import { useEffect, useState, useCallback } from "react";
import { adminHandoverService } from "../services/handoverService";
import type { Handover } from "../../../../types/handover";

export const useHandoverDetail = (id: string | undefined) => {
  const [handover, setHandover] = useState<Handover | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHandoverDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await adminHandoverService.getById(id);
      setHandover(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHandoverDetail();
  }, [fetchHandoverDetail]);

  return { handover, loading, error, fetchHandoverDetail };
};
