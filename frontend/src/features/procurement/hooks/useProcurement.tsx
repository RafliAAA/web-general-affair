import { useEffect, useState } from "react";
import {
  getProcurements,
  createProcurement,
  updateProcurement,
  deleteProcurement,
} from "../services/ProcurementService";
import type { Procurement, CreateProcurementPayload } from "../../../types/procurement";

export const useProcurement = () => {
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProcurements()
      .then(setProcurements)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (payload: CreateProcurementPayload) => {
    const result = await createProcurement(payload);
    setProcurements((prev) => [result, ...prev]);
    return result;
  };

  const handleUpdate = async (
    id: string,
    payload: Partial<CreateProcurementPayload>,
  ) => {
    const result = await updateProcurement(id, payload);
    setProcurements((prev) =>
      prev.map((p) => (p.procurement_id === id ? result : p)),
    );
    return result;
  };

  const handleDelete = async (id: string) => {
    await deleteProcurement(id);
    setProcurements((prev) => prev.filter((p) => p.procurement_id !== id));
  };

  return {
    procurements,
    loading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
