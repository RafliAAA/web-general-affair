
import { Clock, MapPin } from "lucide-react";
import type { RoomBooking } from "@/types/inventory";

interface UpcomingBookingsProps {
  bookings: RoomBooking[];
}

export function UpcomingBookings({ bookings }: UpcomingBookingsProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          Booking Ruangan Mendatang
        </h3>
      </div>
      <div className="divide-y divide-border">
        {bookings.map((booking) => (
          <div key={booking.id} className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-card-foreground">
                  {booking.purpose}
                </p>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {booking.roomName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {booking.startTime} - {booking.endTime}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary">
                  tanggal
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.bookedByName}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
