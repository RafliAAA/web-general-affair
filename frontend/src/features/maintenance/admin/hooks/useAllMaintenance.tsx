import { useEffect, useState } from "react";
import {
  getAllMaintenance,
  verifyMaintenance,
} from "../services/maintenanceService";
import { toast } from "sonner";
import type { Maintenance } from "@/types/maintenance";

export const useAllMaintenance = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllMaintenance()
      .then(setMaintenances)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleVerify = async (maintenance_id: string) => {
    try {
      const updated = await verifyMaintenance(maintenance_id);
      setMaintenances((prev) =>
        prev.map((m) => (m.maintenance_id === maintenance_id ? updated : m)),
      );
      toast.success("Maintenance berhasil diverifikasi");
    } catch {
      toast.error("Gagal memverifikasi maintenance");
    }
  };

  const queue = maintenances.filter((m) => m.status === "MenungguVerifikasi");
  const history = maintenances.filter((m) => m.status !== "MenungguVerifikasi");

  return { queue, history, loading, error, handleVerify };
};
