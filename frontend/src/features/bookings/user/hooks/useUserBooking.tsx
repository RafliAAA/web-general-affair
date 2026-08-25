import { useCallback, useState } from "react";
import { toast } from "sonner";
import { userBookingService } from "../services/UserBookingService";
import type { Booking, CreateBookingPayload } from "@/types/booking";

// User: Mengambil semua booking (untuk cek ketersediaan slot di kalender)
export const useAllBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userBookingService.getAll();
      setBookings(data);
    } catch {
      toast.error("Gagal memuat ketersediaan ruangan");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { bookings, isLoading, fetchAllBookings };
};

// User: Mengambil riwayat booking milik sendiri
export const useMyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMyBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userBookingService.getMy();
      setBookings(data);
    } catch {
      toast.error("Gagal memuat data booking");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { bookings, isLoading, fetchMyBookings };
};

// User: Membuat pengajuan booking baru
export const useCreateBooking = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createBooking = useCallback(
    async (payload: CreateBookingPayload) => {
      setIsSubmitting(true);
      try {
        await userBookingService.create(payload);
        toast.success("Booking berhasil diajukan");
        onSuccess?.();
      } catch {
        toast.error("Gagal mengajukan booking");
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  return { isSubmitting, createBooking };
};

// User: Membatalkan booking miliknya (jika masih Menunggu)
export const useCancelBooking = (onSuccess?: () => void) => {
  const [isCancelling, setIsCancelling] = useState(false);

  const cancelBooking = useCallback(
    async (id: string) => {
      setIsCancelling(true);
      try {
        await userBookingService.cancel(id);
        toast.success("Booking berhasil dibatalkan");
        onSuccess?.();
      } catch {
        toast.error("Gagal membatalkan booking");
      } finally {
        setIsCancelling(false);
      }
    },
    [onSuccess],
  );

  return { isCancelling, cancelBooking };
};