import { useEffect, useState } from "react";
import { Search } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ReviewBookingModal from "../components/ReviewBookingModal";
import { useAdminBookings, useReviewBooking } from "../hooks/useBooking";
import type { Booking, ReviewBookingPayload } from "../services/bookingService";

const STATUS_FILTER = [
  "Semua",
  "Menunggu",
  "Disetujui",
  "Ditolak",
  "Dibatalkan",
];

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

const AdminBookingPage = () => {
  const { bookings, isLoading, fetchBookings } = useAdminBookings();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { isSubmitting, reviewBooking } = useReviewBooking(fetchBookings);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filtered = bookings
    .filter((b) => statusFilter === "Semua" || b.status === statusFilter)
    .filter(
      (b) =>
        b.room.name.toLowerCase().includes(search.toLowerCase()) ||
        b.user.profile.name.toLowerCase().includes(search.toLowerCase()) ||
        b.purpose.toLowerCase().includes(search.toLowerCase()),
    );

  const pendingCount = bookings.filter((b) => b.status === "Menunggu").length;

  const handleReview = async (id: string, payload: ReviewBookingPayload) => {
    await reviewBooking(id, payload);
    setSelectedBooking(null);
  };

  return (
    <DashboardLayout title="Manajemen Booking Ruangan">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari ruangan, pemohon, atau tujuan..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {pendingCount > 0 && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                {pendingCount} Menunggu
              </span>
            )}
            {STATUS_FILTER.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={statusFilter === s ? "default" : "outline"}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Tidak ada data booking
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pemohon</TableHead>
                  <TableHead>Ruangan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Tujuan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.booking_id}>
                    <TableCell className="font-medium">
                      {b.user.profile.name}
                    </TableCell>
                    <TableCell>{b.room.name}</TableCell>
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
                          onClick={() => setSelectedBooking(b)}
                        >
                          Review
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

      {/* Review Modal */}
      <ReviewBookingModal
        open={!!selectedBooking}
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onSubmit={handleReview}
        isSubmitting={isSubmitting}
      />
    </DashboardLayout>
  );
};

export default AdminBookingPage;
