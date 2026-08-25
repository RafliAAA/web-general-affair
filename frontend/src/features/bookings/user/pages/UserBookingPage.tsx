import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CreateBookingModal from "../components/CreateBookingModal";
import RoomList from "../components/RoomList";
import TimeSlots from "../components/TimeSlots";
import {
  useAllBookings,
  useCreateBooking,
  useCancelBooking,
} from "../hooks/useUserBooking";
import { roomService } from "../../../rooms/services/roomsService";
import type { Room } from "../../../rooms/services/roomsService";
import type { CreateBookingPayload } from "@/types/booking";

const UserBookingPage = () => {
  const { bookings, isLoading, fetchAllBookings } = useAllBookings();
  const [rooms, setRooms] = useState<Room[]>([]);

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preselectedStartTime, setPreselectedStartTime] = useState<string>("");
  const [cancelId, setCancelId] = useState<string | null>(null);

  const { isSubmitting, createBooking } = useCreateBooking(fetchAllBookings);
  const { isCancelling, cancelBooking } = useCancelBooking(fetchAllBookings);

  useEffect(() => {
    fetchAllBookings();
    roomService.getAll().then(setRooms).catch(console.error);
  }, [fetchAllBookings]);

  const selectedRoom = rooms.find((r) => r.room_id === selectedRoomId);

  const handleSlotClick = (startTime: string) => {
    setPreselectedStartTime(startTime);
    setIsModalOpen(true);
  };

  const handleCreate = async (payload: CreateBookingPayload) => {
    await createBooking(payload);
    setIsModalOpen(false);
    setPreselectedStartTime("");
  };

  const handleCancel = async () => {
    if (!cancelId) return;
    await cancelBooking(cancelId);
    setCancelId(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BAGIAN KIRI */}
        <TimeSlots
          selectedRoom={selectedRoom}
          selectedDate={selectedDate}
          bookings={bookings}
          isLoading={isLoading}
          onSlotClick={handleSlotClick}
          onCancelSlot={(id) => setCancelId(id)}
        />

        {/* BAGIAN KANAN */}
        <RoomList
          rooms={rooms}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
        />
      </div>

      {/* Modal Create Booking */}
      <CreateBookingModal
        key={isModalOpen ? "open" : "closed"}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPreselectedStartTime("");
        }}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        rooms={rooms}
        preselectedRoom={selectedRoom || null}
        preselectedDate={selectedDate ? new Date(selectedDate) : null}
        preselectedStartTime={preselectedStartTime}
      />

      {/* Konfirmasi Cancel */}
      <AlertDialog open={!!cancelId} onOpenChange={() => setCancelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Booking ini akan dibatalkan dan tidak bisa dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tidak</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? "Membatalkan..." : "Ya, batalkan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserBookingPage;
