import { useCallback, useEffect, useState } from "react";
import {
  createAsset,
  deleteAsset,
  getAssets,
  updateAsset,
} from "../services/assetService";
import type { Asset } from "../../../types/inventory";
import { toast } from "sonner";

export interface AssetMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useAssets = (limitPerPage = 10) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [meta, setMeta] = useState<AssetMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // ← tambah
  const [statusFilter, setStatusFilter] = useState(""); // ← tambah
  const limit = limitPerPage;
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset ke page 1 saat search berubah
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchAssets = useCallback(
    async (params: {
      page: number;
      search: string;
      limit: number;
      status?: string;
    }) => {
      setLoading(true);
      try {
        const result = await getAssets({
          page: params.page,
          limit: params.limit,
          search: params.search || undefined,
          status: params.status || undefined,
        });
        setAssets(result.data);
        setMeta(result.meta);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data aset");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchAssets({ page, limit, search: debouncedSearch, status: statusFilter });
  }, [page ,limit , debouncedSearch, statusFilter, fetchAssets]);

  // Reset ke page 1 saat search berubah
  const handleSearchChange = (value: string) => {
    setSearch(value); // hanya update input, debounce yang trigger fetch
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1); // reset ke page 1 saat filter berubah
  };

  const handleCreate = async (data: Asset) => {
    try {
      const newAsset = await createAsset(data);
      toast.success("Aset berhasil ditambahkan");
      // Refetch supaya pagination tetap akurat
      fetchAssets({ page,
  limit,
  search: debouncedSearch,
  status: statusFilter, });
      return newAsset;
    } catch (error) {
      console.error("Failed to create asset", error);
      toast.error("Gagal menambahkan aset");
    }
  };

  const handleUpdate = async (id: string, data: Partial<Asset>) => {
    try {
      const updatedAsset = await updateAsset(id, data);
      setAssets((prev) =>
        prev.map((a) => (a.asset_id === id ? updatedAsset : a)),
      );
      toast.success("Aset berhasil diperbarui");
      return updatedAsset;
    } catch (error) {
      console.error("Failed to update asset", error);
      toast.error("Gagal memperbarui aset");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAsset(id);
      toast.success("Aset berhasil dihapus");
      fetchAssets({ page,
  limit,
  search: debouncedSearch,
  status: statusFilter, });
    } catch (error) {
      console.error("Failed to delete asset", error);
      toast.error("Gagal menghapus aset");
    }
  };

  return {
    assets,
    meta,
    loading,
    page,
    statusFilter,
    setPage,
    search,
    handleSearchChange,
    handleStatusChange,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
