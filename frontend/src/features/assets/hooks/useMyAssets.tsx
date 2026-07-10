import { useEffect, useState } from "react";
import { getMyAssets } from "../services/assetService";
import type { Asset } from "../../../types/inventory";

export const useMyAssets = (
    excludeMaintenance = false
) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAssets(excludeMaintenance)
      .then(setAssets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [excludeMaintenance]);

  return {
    assets,
    loading,
  };
};