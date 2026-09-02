import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { userProcurementService } from "../services/UserProcurementService";
import type {
  Procurement,
  CreateProcurementPayload,
} from "@/types/procurement";

export const useUserProcurement = (currentUserName: string) => {
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMyProcurements = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userProcurementService.getMyProcurements();
      // Filter agar karyawan hanya melihat PR miliknya sendiri
      const myData = data.filter((p) => p.end_user === currentUserName);
      setProcurements(myData);
    } catch (err) {
      toast.error("Gagal memuat data pengadaan");
    } finally {
      setLoading(false);
    }
  }, [currentUserName]);

  useEffect(() => {
    fetchMyProcurements();
  }, [fetchMyProcurements]);

  const handleCreate = async (payload: CreateProcurementPayload) => {
    setIsSubmitting(true);
    try {
      await userProcurementService.createProcurement(payload);
      toast.success("Pengajuan PR berhasil dibuat!");
      fetchMyProcurements();
    } catch (err) {
      toast.error("Gagal membuat pengajuan PR");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { procurements, loading, isSubmitting, handleCreate };
};
