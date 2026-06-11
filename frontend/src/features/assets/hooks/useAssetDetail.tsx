import { useEffect, useState } from "react";
import { updateAsset, getAssetById } from "../services/assetService";
import type { Asset } from "../../../types/inventory";
import { toast } from "sonner";

export const useAssetDetail = (id: string | undefined) => {
  const [asset, setAssets] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getAssetById(id)
      .then(setAssets)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

   const handleUpdate = async (id: string, data: Partial<Asset>) => {
     try {
       await updateAsset(id, data);

       const fresh = await getAssetById(id);
       setAssets(fresh);
       toast.success("Aset berhasil diperbarui");
     } catch (error) {
       console.error("Failed to update asset", error);
       toast.error("Gagal memperbarui aset");
     }
   };

  return { asset, loading, error, handleUpdate };
};
