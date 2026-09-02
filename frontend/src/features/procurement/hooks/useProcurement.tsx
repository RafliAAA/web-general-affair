import { useEffect, useState, useCallback } from "react";
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

  // 1. FUNGSI FETCH PROCUREMENTS DIBUAT DI SINI
  const fetchProcurements = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProcurements();
      setProcurements(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. FUNGSI DIPANGGIL DI USE EFFECT
  useEffect(() => {
    fetchProcurements();
  }, [fetchProcurements]);

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
    fetchProcurements, 
  };
};