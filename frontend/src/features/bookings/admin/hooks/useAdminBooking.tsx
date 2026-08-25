import { useCallback, useState } from "react";
import { toast } from "sonner";
import { adminBookingService } from "../services/adminBookingService";
import type { Booking, ReviewBookingPayload } from "@/types/booking";

export const useAdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminBookingService.getAll();
      setBookings(data);
    } catch {
      toast.error("Gagal memuat data booking");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { bookings, isLoading, fetchBookings };
};

export const useReviewBooking = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reviewBooking = useCallback(
    async (id: string, payload: ReviewBookingPayload) => {
      setIsSubmitting(true);
      try {
        await adminBookingService.review(id, payload);
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