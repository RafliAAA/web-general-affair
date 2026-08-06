import { useState, useEffect, useCallback } from "react";
import {
  getEntities,
  createEntity,
  updateEntity,
  deleteEntity,
  type Entity,
} from "../services/entityService";
import { toast } from "sonner";

export const useEntity = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEntities();
      setEntities(data);
    } catch (error) {
      console.error("Gagal fetch entities:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  const handleCreateEntity = async (data: { entity_name: string }) => {
    try {
      await createEntity(data);
      toast.success("Entity berhasil ditambahkan!");
      fetchEntities();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menambahkan entity");
    }
  };

  const handleUpdateEntity = async (
    id: string,
    data: { entity_name: string },
  ) => {
    try {
      await updateEntity(id, data);
      toast.success("Entity berhasil diperbarui!");
      fetchEntities();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memperbarui entity");
    }
  };

  const handleDeleteEntity = async (id: string) => {
    try {
      await deleteEntity(id);
      toast.success("Entity berhasil dihapus!");
      fetchEntities();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menghapus entity");
    }
  };

  return {
    entities,
    loading,
    fetchEntities,
    handleCreateEntity,
    handleUpdateEntity,
    handleDeleteEntity,
  };
};
