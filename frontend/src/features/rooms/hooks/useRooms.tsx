import { useCallback, useState } from "react";
import { toast } from "sonner";
import { roomService } from "../services/roomsService";
import type { Room, CreateRoomPayload } from "../services/roomsService";

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await roomService.getAll();
      setRooms(data);
    } catch {
      toast.error("Gagal memuat data ruangan");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { rooms, isLoading, fetchRooms };
};

export const useRoomDetail = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRoom = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const data = await roomService.getById(id);
      setRoom(data);
    } catch {
      toast.error("Gagal memuat detail ruangan");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { room, isLoading, fetchRoom };
};

export const useCreateRoom = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createRoom = useCallback(
    async (payload: CreateRoomPayload) => {
      setIsSubmitting(true);
      try {
        await roomService.create(payload);
        toast.success("Ruangan berhasil ditambahkan");
        onSuccess?.();
      } catch {
        toast.error("Gagal menambahkan ruangan");
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  return { isSubmitting, createRoom };
};

export const useUpdateRoom = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateRoom = useCallback(
    async (id: string, payload: Partial<CreateRoomPayload>) => {
      setIsSubmitting(true);
      try {
        await roomService.update(id, payload);
        toast.success("Ruangan berhasil diupdate");
        onSuccess?.();
      } catch {
        toast.error("Gagal mengupdate ruangan");
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  return { isSubmitting, updateRoom };
};

export const useDeleteRoom = (onSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteRoom = useCallback(
    async (id: string) => {
      setIsDeleting(true);
      try {
        await roomService.delete(id);
        toast.success("Ruangan berhasil dihapus");
        onSuccess?.();
      } catch {
        toast.error("Gagal menghapus ruangan");
      } finally {
        setIsDeleting(false);
      }
    },
    [onSuccess],
  );

  return { isDeleting, deleteRoom };
};
