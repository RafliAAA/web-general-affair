import { useEffect, useState } from "react";
import { adminHandoverService } from "../services/handoverService";
import type {
  Handover,
  ReturnHandoverPayload,
} from "../../../../types/handover";

export const useHandoverDetail = (id: string | undefined) => {
  const [handover, setHandover] = useState<Handover | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    adminHandoverService
      .getById(id)
      .then((res) => setHandover(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReturn = async (payload: ReturnHandoverPayload) => {
    if (!id) return;
    const res = await adminHandoverService.returnHandover(id, payload);
    setHandover(res.data);
    return res.data;
  };

  return { handover, loading, error, handleReturn };
};
