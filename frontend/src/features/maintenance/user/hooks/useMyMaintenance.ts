import { useEffect, useState } from "react";
import { getMyMaintenance, createMaintenance } from "../services/maintenanceService";
import { toast } from "sonner";
import type { CreateMaintenancePayload, Maintenance } from "@/types/maintenance";

export const useMyMaintenance = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyMaintenance()
      .then(setMaintenances)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (payload: CreateMaintenancePayload) => {
    try {
      const result = await createMaintenance(payload);
      setMaintenances((prev) => [result, ...prev]);
      toast.success("Laporan maintenance berhasil dibuat");
      return result;
    } catch {
      toast.error("Gagal membuat laporan maintenance");
      throw new Error("Gagal membuat laporan maintenance");
    }
  };

  return { maintenances, loading, error, handleCreate };
};