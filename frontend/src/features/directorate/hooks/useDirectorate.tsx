import { useState, useEffect, useCallback } from "react";
import {
  getDirectorates,
  createDirectorate,
  updateDirectorate,
  deleteDirectorate,
  type Directorate,
} from "../services/directorateService";
import { toast } from "sonner";

export const useDirectorate = (initialEntityId?: string) => {
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDirectorates = useCallback(async (entity_id?: string) => {
    try {
      setLoading(true);
      const data = await getDirectorates(entity_id);
      setDirectorates(data);
    } catch (error) {
      console.error("Gagal fetch directorates:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDirectorates(initialEntityId);
  }, [fetchDirectorates, initialEntityId]);

  const handleCreateDirectorate = async (data: {
    directorate_name: string;
    entity_id: string;
  }) => {
    try {
      await createDirectorate(data);
      toast.success("Direktorat berhasil ditambahkan!");
      fetchDirectorates();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Gagal menambahkan direktorat",
      );
    }
  };

  const handleUpdateDirectorate = async (
    id: string,
    data: { directorate_name: string; entity_id: string },
  ) => {
    try {
      await updateDirectorate(id, data);
      toast.success("Direktorat berhasil diperbarui!");
      fetchDirectorates();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui direktorat",
      );
    }
  };

  const handleDeleteDirectorate = async (id: string) => {
    try {
      await deleteDirectorate(id);
      toast.success("Direktorat berhasil dihapus!");
      fetchDirectorates();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Gagal menghapus direktorat",
      );
    }
  };

  return {
    directorates,
    loading,
    fetchDirectorates,
    handleCreateDirectorate,
    handleUpdateDirectorate,
    handleDeleteDirectorate,
  };
};
