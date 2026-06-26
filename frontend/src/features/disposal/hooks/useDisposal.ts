import { useEffect, useState } from "react";
import {
  getDisposals,
  createDisposal,
  updateDisposal,
  deleteDisposal,
} from "../services/disposalService";
import type {
  Disposal,
  CreateDisposalPayload,
} from "../services/disposalService";

export const useDisposal = () => {
  const [disposals, setDisposals] = useState<Disposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDisposals()
      .then(setDisposals)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (payload: CreateDisposalPayload) => {
    const result = await createDisposal(payload);
    setDisposals((prev) => [result, ...prev]);
    return result;
  };

  const handleUpdate = async (
    id: string,
    payload: Partial<CreateDisposalPayload>,
  ) => {
    const result = await updateDisposal(id, payload);
    setDisposals((prev) =>
      prev.map((d) => (d.disposal_id === id ? result : d)),
    );
    return result;
  };

  const handleDelete = async (id: string) => {
    await deleteDisposal(id);
    setDisposals((prev) => prev.filter((d) => d.disposal_id !== id));
  };

  return {
    disposals,
    loading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
