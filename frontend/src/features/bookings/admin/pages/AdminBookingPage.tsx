import { useEffect, useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Building2,
  Briefcase,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ReviewBookingModal from "../components/ReviewBookingModal";
import { useAdminBookings, useReviewBooking } from "../hooks/useAdminBooking";
import type {
  Booking,
  ReviewBookingPayload,
} from "@/types/booking";

const STATUS_FILTER = [
  "Semua",
  "Menunggu",
  "Disetujui",
  "Ditolak",
  "Dibatalkan",
];

const getBookingCardStyle = (status: string) => {
  switch (status) {
    case "Disetujui":
      return "bg-green-100 border-green-800 hover:bg-green-200  text-emerald-900";
    case "Menunggu":
      return "bg-orange-100 border-amber-500 hover:bg-amber-200/80 text-amber-900";
    case "Ditolak":
    case "Dibatalkan":
      return "bg-rose-100/80 border-rose-500 hover:bg-rose-200/80 text-rose-900";
    default:
      return "bg-slate-100/80 border-slate-500 hover:bg-slate-200/80 text-slate-900";
  }
};

const START_HOUR = 8;
const END_HOUR = 17;
const HOUR_HEIGHT = 64;

const AdminBookingPage = () => {
  const { bookings, isLoading, fetchBookings } = useAdminBookings();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const { isSubmitting, reviewBooking } = useReviewBooking(fetchBookings);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filtered = bookings
    .filter((b) => statusFilter === "Semua" || b.status === statusFilter)
    .filter((b) => b.status === "Menunggu" || b.status === "Disetujui")
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

  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentWeek);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);

    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }, [currentWeek]);

  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    filtered.forEach((b) => {
      const dateKey = new Date(b.date).toDateString();
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(b);
    });
    Object.keys(map).forEach((key) => {
      map[key].sort((a, b) => a.start_time.localeCompare(b.start_time));
    });
    return map;
  }, [filtered]);

  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }).map(
    (_, i) => {
      const h = START_HOUR + i;
      return `${String(h).padStart(2, "0")}:00`;
    },
  );

  const prevWeek = () =>
    setCurrentWeek(
      new Date(
        currentWeek.getFullYear(),
        currentWeek.getMonth(),
        currentWeek.getDate() - 7,
      ),
    );
  const nextWeek = () =>
    setCurrentWeek(
      new Date(
        currentWeek.getFullYear(),
        currentWeek.getMonth(),
        currentWeek.getDate() + 7,
      ),
    );

  return (
    <>
      <div className="space-y-6">
        {/* Header & Filter */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari ruangan, pemohon, atau tujuan..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeek(new Date())}
              >
                Hari Ini
              </Button>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={prevWeek}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={nextWeek}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-semibold tracking-tight capitalize">
              {currentWeek.toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
              })}
            </h2>
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
                  className="h-8"
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Konten Kalender */}
        <div className="rounded-xl border border-border overflow-hidden shadow-sm flex flex-col bg-card">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <>
              {/* Header Hari */}
              <div className="grid grid-cols-[50px_repeat(7,1fr)] border-b border-border bg-muted/40">
                <div className="border-r border-border"></div>
                {weekDays.map((day) => {
                  const isToday =
                    day.toDateString() === new Date().toDateString();
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "p-2 text-center border-r border-border",
                        isToday && "bg-primary/5",
                      )}
                    >
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                        {day.toLocaleDateString("id-ID", { weekday: "short" })}
                      </p>
                      <div
                        className={cn(
                          "mt-1 mx-auto w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold",
                          isToday
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground",
                        )}
                      >
                        {day.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Body Kalender */}
              <div
                className="flex"
                style={{
                  height: `${(END_HOUR - START_HOUR) * HOUR_HEIGHT + 20}px`,
                }}
              >
                {/* Kolom Waktu (Kiri) */}
                <div className="w-12.5 relative shrink-0 bg-muted/30 border-r border-border">
                  {hours.map((h, i) => (
                    <div
                      key={h}
                      className="absolute right-2 text-[10px] font-medium text-muted-foreground/70"
                      style={{ top: `${i * HOUR_HEIGHT - 5}px` }}
                    >
                      {h}
                    </div>
                  ))}
                </div>

                {/* Kolom Hari (Konten) */}
                <div className="flex-1 flex">
                  {weekDays.map((day) => {
                    const dayKey = day.toDateString();
                    const dayBookings = bookingsByDate[dayKey] || [];

                    let prevEndHour = 0;
                    let stackLevel = 0;

                    return (
                      <div
                        key={day.toISOString()}
                        className="flex-1 relative border-r border-border"
                      >
                        {/* Background Grid (Garis sangat samar) */}
                        {hours.map((h, i) => (
                          <div
                            key={h}
                            className="absolute left-0 right-0 border-t border-slate-100"
                            style={{ top: `${i * HOUR_HEIGHT}px` }}
                          />
                        ))}

                        {/* Render Booking */}
                        {dayBookings.map((b) => {
                          const startHour = parseInt(b.start_time.slice(0, 2));
                          const endHour = parseInt(b.end_time.slice(0, 2));

                          if (startHour < prevEndHour) {
                            stackLevel++;
                          } else {
                            stackLevel = 0;
                          }
                          prevEndHour = Math.max(prevEndHour, endHour);

                          const top = (startHour - START_HOUR) * HOUR_HEIGHT;
                          const height = (endHour - startHour) * HOUR_HEIGHT;
                          const leftOffset = stackLevel * 16;
                          const widthOffset = stackLevel * 16;

                          return (
                            <Popover key={b.booking_id}>
                              <PopoverTrigger asChild>
                                {/* DESIGN KARTU YANG SANGAT CLEAN */}
                                <div
                                  style={{
                                    top: `${top + 2}px`,
                                    height: `${height - 4}px`,
                                    left: `${leftOffset + 2}px`,
                                    width: `calc(100% - ${widthOffset + 4}px)`,
                                    zIndex: stackLevel + 1,
                                  }}
                                  className={cn(
                                    "absolute p-2 rounded-md flex flex-col gap-0.5 cursor-pointer transition-all shadow-sm overflow-hidden",
                                    getBookingCardStyle(b.status),
                                  )}
                                >
                                  <span className="font-bold text-[11px] leading-tight truncate">
                                    {b.room.name}
                                  </span>
                                  <span className="text-[10px] leading-tight truncate opacity-80">
                                    {b.user?.profile?.name}
                                  </span>
                                </div>
                              </PopoverTrigger>

                              {/* TOOLTIP DETAIL (Muncul saat klik) */}
                              <PopoverContent
                                className="w-72 p-0 border border-border shadow-xl"
                                align="start"
                                side="right"
                              >
                                <div className="p-3 space-y-3 bg-card rounded-lg">
                                  <div className="flex justify-between items-start gap-2">
                                    <span className="font-semibold text-sm">
                                      {b.room.name}
                                    </span>
                                    <Badge
                                      variant={
                                        b.status === "Disetujui"
                                          ? "default"
                                          : "outline"
                                      }
                                      className={
                                        b.status === "Disetujui"
                                          ? "bg-green-100 text-green-800"
                                          : b.status === "Menunggu"
                                            ? "bg-orange-100 text-orange-800"
                                            : "bg-red-500 text-white"
                                      }
                                    >
                                      {b.status}
                                    </Badge>
                                  </div>
                                  <div className="text-xs space-y-2">
                                    <p className="flex items-center gap-2 text-muted-foreground">
                                      <Clock className="h-3 w-3" />{" "}
                                      {b.start_time} - {b.end_time}
                                    </p>
                                    <p className="flex items-center gap-2 text-muted-foreground">
                                      <User className="h-3 w-3" />{" "}
                                      {b.user?.profile?.name}
                                    </p>
                                    <p className="flex items-center gap-2 text-muted-foreground">
                                      <Building2 className="h-3 w-3" />{" "}
                                      {b.user?.profile?.entity?.entity_name ||
                                        "-"}
                                    </p>
                                    <p className="flex items-center gap-2 text-muted-foreground">
                                      <Briefcase className="h-3 w-3" />{" "}
                                      {b.user?.profile?.directorate
                                        ?.directorate_name || "-"}
                                    </p>
                                  </div>
                                  <div className="bg-muted/50 p-2 rounded-md text-xs italic border-primary">
                                    "{b.purpose}"
                                  </div>

                                  {b.status === "Menunggu" && (
                                    <Button
                                      className="w-full"
                                      size="sm"
                                      onClick={() => setSelectedBooking(b)}
                                    >
                                      Review Booking
                                    </Button>
                                  )}
                                </div>
                              </PopoverContent>
                            </Popover>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground italic">
          Klik kartu untuk melihat detail. Klik tombol Review pada detail untuk
          menyetujui/menolak.
        </p>
      </div>

      <ReviewBookingModal
        open={!!selectedBooking}
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onSubmit={handleReview}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default AdminBookingPage;
