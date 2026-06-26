import { useEffect, useState } from "react";
import { getMaintenanceById } from "../services/maintenanceService";
import type { Maintenance } from "@/types/maintenance";

export const useMaintenanceDetail = (id: string | undefined) => {
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getMaintenanceById(id)
      .then(setMaintenance)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { maintenance, loading, error };
};
