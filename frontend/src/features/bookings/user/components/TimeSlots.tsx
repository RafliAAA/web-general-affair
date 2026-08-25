import { useMemo } from "react";
import { Clock, DoorOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Booking } from "../../admin/services/adminBookingService";
import type { Room } from "../../../rooms/services/roomsService";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

const START_HOUR = 8;
const END_HOUR = 17;

interface TimeSlotsProps {
  selectedRoom: Room | undefined;
  selectedDate: string;
  bookings: Booking[];
  isLoading: boolean;
  onSlotClick: (startTime: string) => void;
  onCancelSlot: (id: string) => void;
}

const TimeSlots = ({
  selectedRoom,
  selectedDate,
  bookings,
  isLoading,
  onSlotClick,
  onCancelSlot,
}: TimeSlotsProps) => {
  const { user } = useAuthStore();
  const currentUserId = user?.id;
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = START_HOUR; h < END_HOUR; h++) {
      const startTime = `${String(h).padStart(2, "0")}:00`;

      const isBooked = bookings.some((b) => {
        if (b.room_id !== selectedRoom?.room_id) return false;
        if (
          new Date(b.date).toDateString() !==
          new Date(selectedDate).toDateString()
        )
          return false;

        // Hanya cek bentrok jika statusnya Disetujui atau Menunggu
        if (b.status === "Ditolak" || b.status === "Dibatalkan") return false;
        const bStart = parseInt(b.start_time.slice(0, 2));
        const bEnd = parseInt(b.end_time.slice(0, 2));
        return h >= bStart && h < bEnd;
      });

      // Cek apakah ini booking MILIK SENDIRI yang masih Menunggu
      const myPendingBooking = bookings.find((b) => {
        if (b.room_id !== selectedRoom?.room_id) return false;
        if (
          new Date(b.date).toDateString() !==
          new Date(selectedDate).toDateString()
        )
          return false;
        if (b.status !== "Menunggu") return false;
        if (b.user_id !== currentUserId) return false;

        const bStart = parseInt(b.start_time.slice(0, 2));
        const bEnd = parseInt(b.end_time.slice(0, 2));
        return h >= bStart && h < bEnd;
      });

      slots.push({ startTime, isBooked, myPendingBooking });
    }
    return slots;
  }, [bookings, selectedDate, selectedRoom, currentUserId]);

  if (!selectedRoom) {
    return (
      <div className="lg:col-span-2 rounded-xl border bg-card p-4 min-h-75 flex flex-col items-center justify-center text-center py-20">
        <DoorOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground font-medium">
          Pilih ruangan terlebih dahulu
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Untuk melihat ketersediaan jam
        </p>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 rounded-xl border bg-card p-4 min-h-75">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Slot Tersedia
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedRoom?.name} -{" "}
              {new Date(selectedDate).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {timeSlots.map((slot) => {
              const isMyPending = !!slot.myPendingBooking;
              return (
                <button
                  key={slot.startTime}
                  disabled={slot.isBooked && !isMyPending}
                  onClick={() =>
                    isMyPending
                      ? onCancelSlot(slot.myPendingBooking!.booking_id)
                      : onSlotClick(slot.startTime)
                  }
                  className={cn(
                    "p-3 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1",
                    isMyPending
                      ? "bg-yellow-50 border-yellow-400 text-yellow-700 hover:bg-yellow-100"
                      : slot.isBooked
                        ? "bg-muted/50 border-muted text-muted-foreground cursor-not-allowed opacity-60"
                        : "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary cursor-pointer",
                  )}
                >
                  <span className="text-sm font-bold">{slot.startTime}</span>
                  <span className="text-[10px]">
                    {isMyPending
                      ? "Klik untuk Batal"
                      : slot.isBooked
                        ? "Booked"
                        : "Tersedia"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlots;
