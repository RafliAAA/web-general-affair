import { DoorOpen, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Room } from "../../../rooms/services/roomsService";

interface RoomListProps {
  rooms: Room[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string) => void;
}

const RoomList = ({
  rooms,
  selectedDate,
  setSelectedDate,
  selectedRoomId,
  setSelectedRoomId,
}: RoomListProps) => {
  return (
    <div className="lg:col-span-1 space-y-4">
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Pilih Tanggal</h3>
        </div>
        <Input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <DoorOpen className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Pilih Ruangan</h3>
        </div>
        <div className="space-y-2 max-h-100 overflow-y-auto pr-1">
          {rooms
            .filter((r) => r.status === "Tersedia")
            .map((room) => (
              <div
                key={room.room_id}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-colors",
                  selectedRoomId === room.room_id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:bg-muted/50",
                )}
                onClick={() => setSelectedRoomId(room.room_id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{room.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {room.location} · {room.capacity} Orang
                    </p>
                  </div>
                  {selectedRoomId === room.room_id && (
                    <Badge variant="default" className="text-[10px]">
                      Dipilih
                    </Badge>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RoomList;
