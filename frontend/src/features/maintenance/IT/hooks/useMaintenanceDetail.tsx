import { useEffect, useState } from "react";
import { getMaintenanceById, getActualizationForm } from "../services/MaintenanceService";
import type { Maintenance, ActualizationForm } from "@/types/maintenance";

export const useMaintenanceDetailIT = (id: string | undefined) => {
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
  const [actualization, setActualization] = useState<ActualizationForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getMaintenanceById(id);
        setMaintenance(data);

        if (data.status === "TidakDapatDiperbaiki") {
          try {
            const form = await getActualizationForm(id);
            setActualization(form);
          } catch {
            // form belum ada
          }
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { maintenance, actualization, loading, error };
};