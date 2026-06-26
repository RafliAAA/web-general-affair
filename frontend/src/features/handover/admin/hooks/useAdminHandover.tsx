import { useState, useCallback } from "react";
import { toast } from "sonner";
import { adminHandoverService } from "../services/handoverService";
import type { CreateHandoverPayload, Handover, ReturnHandoverPayload } from "@/types/handover";

export const useAdminHandovers = () => {
  const [handovers, setHandovers] = useState<Handover[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHandovers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminHandoverService.getAll();
      setHandovers(res.data);
    } catch {
      toast.error("Gagal memuat data handover");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { handovers, isLoading, fetchHandovers };
};

export const useAdminHandoverDetail = () => {
  const [handover, setHandover] = useState<Handover | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDetail = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const res = await adminHandoverService.getById(id);
      setHandover(res.data);
    } catch {
      toast.error("Gagal memuat detail handover");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { handover, isLoading, fetchDetail };
};

export const useCreateHandover = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createHandover = useCallback(
    async (payload: CreateHandoverPayload) => {
      setIsSubmitting(true);
      try {
        await adminHandoverService.create(payload);
        toast.success("Handover berhasil dibuat");
        onSuccess?.();
      } catch {
        toast.error("Gagal membuat handover");
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  return { isSubmitting, createHandover };
};

export const useReturnHandover = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const returnHandover = useCallback(
    async (id: string, payload: ReturnHandoverPayload) => {
      setIsSubmitting(true);
      try {
        await adminHandoverService.returnHandover(id, payload);
        toast.success("Handover berhasil dikembalikan");
        onSuccess?.();
      } catch {
        toast.error("Gagal memproses pengembalian");
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  return { isSubmitting, returnHandover };
};

export const useDeleteHandover = (onSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteHandover = useCallback(
    async (id: string) => {
      setIsDeleting(true);
      try {
        await adminHandoverService.delete(id);
        toast.success("Handover berhasil dihapus");
        onSuccess?.();
      } catch {
        toast.error("Gagal menghapus handover");
      } finally {
        setIsDeleting(false);
      }
    },
    [onSuccess],
  );

  return { isDeleting, deleteHandover };
};
