import { useState, useEffect } from "react";
import { toast } from "sonner";
import { assetService, type Asset } from "../services/handoverService";

export const useAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const res = await assetService.getAll();
        // hanya tampilkan aset yang tersedia
        setAssets(res.data.filter((a) => a.status === "Tersedia"));
      } catch {
        toast.error("Gagal memuat daftar aset");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return { assets, isLoading };
};
