import { useEffect, useState } from "react";
import {
  getAllMaintenance,
  takeMaintenance,
  completeMaintenance,
  cannotRepairMaintenance,
} from "../services/MaintenanceService";
import { toast } from "sonner";
import type { CannotRepairPayload, Maintenance } from "@/types/maintenance";

export const useITMaintenance = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllMaintenance()
      .then(setMaintenances)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const updateList = (updated: Maintenance) => {
    setMaintenances((prev) =>
      prev.map((m) =>
        m.maintenance_id === updated.maintenance_id ? updated : m,
      ),
    );
  };

  const handleTake = async (maintenance_id: string) => {
    try {
      const updated = await takeMaintenance(maintenance_id);
      updateList(updated);
      toast.success("Maintenance berhasil diambil");
    } catch {
      toast.error("Gagal mengambil maintenance");
    }
  };

  const handleComplete = async (
    maintenance_id: string,
    resolution_notes: string,
  ) => {
    try {
      const updated = await completeMaintenance(
        maintenance_id,
        resolution_notes,
      );
      updateList(updated);
      toast.success("Maintenance berhasil diselesaikan");
    } catch {
      toast.error("Gagal menyelesaikan maintenance");
    }
  };

  const handleCannotRepair = async (
    maintenance_id: string,
    payload: CannotRepairPayload,
  ) => {
    try {
      const updated = await cannotRepairMaintenance(maintenance_id, payload);
      updateList(updated);
      toast.success("Maintenance ditandai tidak dapat diperbaiki");
    } catch {
      toast.error("Gagal memperbarui maintenance");
    }
  };

  const queue = maintenances.filter((m) => m.status === "MenungguDikerjakan");
  const inProgress = maintenances.filter(
    (m) => m.status === "SedangDikerjakan",
  );
  const history = maintenances.filter((m) =>
    ["Selesai", "TidakDapatDiperbaiki", "Ditolak"].includes(m.status),
  );

  return {
    queue,
    inProgress,
    history,
    loading,
    error,
    handleTake,
    handleComplete,
    handleCannotRepair,
  };
};
