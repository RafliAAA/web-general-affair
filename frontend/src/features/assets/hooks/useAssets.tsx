import { useEffect, useState } from "react";
import {
  createAsset,
  deleteAsset,
  getAssets,
  updateAsset,
} from "../services/assetService";
import type { Asset } from "../../../types/inventory";

export const useAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssets()
      .then(setAssets)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (data: Asset) => {
    try {
      const newAsset = await createAsset(data);
      setAssets((prev) => [...prev, newAsset]);
    } catch (error) {
      console.error("Failed to create asset", error);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Asset>) => {
    try {
      const updatedAsset = await updateAsset(id, data);

      setAssets((prev) => prev.map((a) => (a.asset_id === id ? updatedAsset : a)));
    } catch (error) {
      console.error("Failed to update asset", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAsset(id);
      setAssets((prev) => prev.filter((a) => a.asset_id !== id));
    } catch (error) {
      console.error("Failed to update asset", error);
    }
  };

  return { assets, loading, handleCreate, handleUpdate, handleDelete };
};
