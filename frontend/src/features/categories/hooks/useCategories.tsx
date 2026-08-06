import { useState, useEffect, useCallback } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type AssetCategory,
} from "../services/categoryService";
import { toast } from "sonner";

export const useCategories = () => {
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Gagal fetch kategori:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async (data: {
    category_name: string;
    category_code: string;
  }) => {
    try {
      await createCategory(data);
      toast.success("Kategori berhasil ditambahkan!");
      fetchCategories();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Gagal menambahkan kategori",
      );
    }
  };

  const handleUpdate = async (
    id: string,
    data: { category_name?: string; category_code?: string },
  ) => {
    try {
      await updateCategory(id, data);
      toast.success("Kategori berhasil diperbarui!");
      fetchCategories();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui kategori",
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success("Kategori berhasil dihapus!");
      fetchCategories();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Gagal menghapus kategori. Mungkin masih dipakai aset.",
      );
    }
  };

  return {
    categories,
    loading,
    fetchCategories,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
