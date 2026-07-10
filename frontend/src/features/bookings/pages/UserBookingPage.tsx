import { useEffect, useState } from "react";
import {
  Search,
  Package,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
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
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreateBookingModal from "../components/CreateBookingModal";
import {
  useMyBookings,
  useCreateBooking,
  useCancelBooking,
} from "../hooks/useBooking";
import { roomService } from "../../rooms/services/roomsService";
import type {
  BookingRoom,
  CreateBookingPayload,
} from "../services/bookingService";
import type { Room } from "../../rooms/services/roomsService";

const statusVariant = (status: string) => {
  switch (status) {
    case "Disetujui":
      return "success";
    case "Menunggu":
      return "outline";
    case "Ditolak":
    case "Dibatalkan":
      return "destructive";
    default:
      return "outline";
  }
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const UserBookingPage = () => {
  const { bookings, isLoading, fetchMyBookings } = useMyBookings();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<BookingRoom | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);

  const { isSubmitting, createBooking } = useCreateBooking(fetchMyBookings);
  const { isCancelling, cancelBooking } = useCancelBooking(fetchMyBookings);

  useEffect(() => {
    fetchMyBookings();
    roomService.getAll().then(setRooms).catch(console.error);
  }, [fetchMyBookings]);

  const filteredBookings = bookings.filter(
    (b) =>
      b.room.name.toLowerCase().includes(search.toLowerCase()) ||
      b.purpose.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = async (payload: CreateBookingPayload) => {
    await createBooking(payload);
    setSelectedRoom(null);
  };

  const handleCancel = async () => {
    if (!cancelId) return;
    await cancelBooking(cancelId);
    setCancelId(null);
  };

  return (
    <DashboardLayout title="Booking Ruangan">
      <div className="space-y-6">
        {/* Daftar Ruangan Tersedia */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Ruangan tersedia
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {rooms
              .filter((r) => r.status === "Tersedia")
              .map((room) => (
                <div
                  key={room.room_id}
                  className="rounded-lg border bg-card p-4 space-y-3 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedRoom(room)}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-md bg-muted">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Badge variant="success" className="text-xs">
                      Tersedia
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{room.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {room.location} · {room.capacity} orang
                    </p>
                  </div>
                  {room.facilities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {room.facilities.slice(0, 3).map((f) => (
                        <Badge
                          key={f.facility_id}
                          variant="outline"
                          className="text-xs"
                        >
                          {f.name}
                        </Badge>
                      ))}
                      {room.facilities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{room.facilities.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                  >
                    Booking
                  </Button>
                </div>
              ))}
          </div>
        </div>

        {/* Riwayat Booking */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Riwayat booking saya
            </p>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari booking..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Belum ada riwayat booking
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ruangan</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Tujuan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((b) => (
                    <TableRow key={b.booking_id}>
                      <TableCell className="font-medium">
                        {b.room.name}
                      </TableCell>
                      <TableCell>{formatDate(b.date)}</TableCell>
                      <TableCell>
                        {b.start_time} – {b.end_time}
                      </TableCell>
                      <TableCell className="max-w-40 truncate text-muted-foreground text-sm">
                        {b.purpose}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(b.status)}>
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {b.status === "Menunggu" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
                            onClick={() => setCancelId(b.booking_id)}
                          >
                            Batalkan
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>

      {/* Create Booking Modal */}
      <CreateBookingModal
        open={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        room={selectedRoom}
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
    </DashboardLayout>
  );
};

export default UserBookingPage;
