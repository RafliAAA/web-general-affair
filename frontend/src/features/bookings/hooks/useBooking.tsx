import { useCallback, useState } from "react";
import { toast } from "sonner";
import { bookingService } from "../services/bookingService";
import type {
  Booking,
  CreateBookingPayload,
  ReviewBookingPayload,
} from "../services/bookingService";

// GA — semua booking
export const useAdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await bookingService.getAll();
      setBookings(data);
    } catch {
      toast.error("Gagal memuat data booking");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { bookings, isLoading, fetchBookings };
};

// Karyawan — booking milik sendiri
export const useMyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMyBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await bookingService.getMy();
      setBookings(data);
    } catch {
      toast.error("Gagal memuat data booking");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { bookings, isLoading, fetchMyBookings };
};

// Create booking (karyawan)
export const useCreateBooking = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createBooking = useCallback(
    async (payload: CreateBookingPayload) => {
      setIsSubmitting(true);
      try {
        await bookingService.create(payload);
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

// Review booking (GA)
export const useReviewBooking = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reviewBooking = useCallback(
    async (id: string, payload: ReviewBookingPayload) => {
      setIsSubmitting(true);
      try {
        await bookingService.review(id, payload);
        toast.success(
          payload.status === "Disetujui"
            ? "Booking disetujui"
            : "Booking ditolak",
        );
        onSuccess?.();
      } catch {
        toast.error("Gagal memproses booking");
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  return { isSubmitting, reviewBooking };
};

// Cancel booking (karyawan)
export const useCancelBooking = (onSuccess?: () => void) => {
  const [isCancelling, setIsCancelling] = useState(false);

  const cancelBooking = useCallback(
    async (id: string) => {
      setIsCancelling(true);
      try {
        await bookingService.cancel(id);
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
