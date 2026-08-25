import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Clock, MapPin, AlertCircle } from "lucide-react";
import type { CreateBookingPayload } from "../../admin/services/adminBookingService";
import type { Room } from "../../../rooms/services/roomsService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateBookingPayload) => Promise<void>;
  isSubmitting: boolean;
  rooms: Room[];
  preselectedRoom?: Room | null;
  preselectedDate?: Date | null;
  preselectedStartTime?: string;
}

// Jam operasional kantor
const OPERATING_HOURS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

// Helper untuk format Date ke string "YYYY-MM-DD"
const getInitialDate = (date?: Date | null) => {
  if (!date) return new Date().toISOString().split("T")[0];
  const d = new Date(date);
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().split("T")[0];
};

const CreateBookingModal = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  rooms,
  preselectedRoom,
  preselectedDate,
  preselectedStartTime,
}: Props) => {
  const [form, setForm] = useState(() => ({
    room_id: preselectedRoom?.room_id || "",
    date: getInitialDate(preselectedDate),
    start_time: preselectedStartTime || "",
    end_time: preselectedStartTime
      ? `${String(parseInt(preselectedStartTime.slice(0, 2)) + 1).padStart(2, "0")}:00`
      : "",
    purpose: "",
  }));

  const selectedRoomData = useMemo(() => {
    return rooms.find((r) => r.room_id === form.room_id);
  }, [rooms, form.room_id]);

  const endHourOptions = useMemo(() => {
    if (!form.start_time) return OPERATING_HOURS;
    return OPERATING_HOURS.filter((h) => h > form.start_time);
  }, [form.start_time]);

  const timeValidation = useMemo(() => {
    if (!form.start_time || !form.end_time)
      return { valid: false, durationText: "", isError: false };

    const [sh, sm] = form.start_time.split(":").map(Number);
    const [eh, em] = form.end_time.split(":").map(Number);

    const startMins = sh * 60 + sm;
    const endMins = eh * 60 + em;

    if (endMins <= startMins) {
      return {
        valid: false,
        durationText: "Jam selesai harus setelah jam mulai",
        isError: true,
      };
    }

    const diffMins = endMins - startMins;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    let durationText = "Durasi: ";
    if (hours > 0) durationText += `${hours} Jam `;
    if (mins > 0) durationText += `${mins} Menit`;

    return { valid: true, durationText, isError: false };
  }, [form.start_time, form.end_time]);

  const isValid =
    form.room_id &&
    form.date &&
    form.start_time &&
    form.end_time &&
    form.purpose &&
    timeValidation.valid;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartTimeChange = (val: string) => {
    setForm((prev) => {
      let newEndTime = prev.end_time;
      if (!newEndTime || newEndTime <= val) {
        const nextHour = OPERATING_HOURS.find((h) => h > val);
        newEndTime = nextHour || "";
      }
      return { ...prev, start_time: val, end_time: newEndTime };
    });
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    await onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Ajukan Booking Ruangan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Pilih Ruangan */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Ruangan</Label>
            {selectedRoomData && (
              <div className="mt-2 rounded-lg border bg-muted/30 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{selectedRoomData.name}</p>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 hover:bg-green-100"
                  >
                    Tersedia
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {selectedRoomData.capacity}{" "}
                    Orang
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {selectedRoomData.location}
                  </span>
                </div>
                {selectedRoomData.facilities?.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {selectedRoomData.facilities.map((f) => (
                      <Badge
                        key={f.facility_id}
                        variant="outline"
                        className="text-[10px] font-normal"
                      >
                        {f.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tanggal */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Tanggal</Label>
            <Input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          {/* Waktu */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-muted-foreground">
                  Jam Mulai
                </Label>
                <Select
                  value={form.start_time ? form.start_time : undefined}
                  onValueChange={handleStartTimeChange}
                  disabled={!!preselectedStartTime}
                >
                  <SelectTrigger
                    className={
                      preselectedStartTime
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Jam Mulai" />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATING_HOURS.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Jam Selesai
                </Label>
                <Select
                  value={form.end_time ? form.end_time : undefined}
                  onValueChange={(val) => handleChange("end_time", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Jam Selesai" />
                  </SelectTrigger>
                  <SelectContent>
                    {endHourOptions.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {timeValidation.durationText && (
              <div
                className={`flex items-center gap-1.5 text-xs ${timeValidation.isError ? "text-red-600" : "text-primary"}`}
              >
                {timeValidation.isError ? (
                  <AlertCircle className="h-3 w-3" />
                ) : (
                  <Clock className="h-3 w-3" />
                )}
                <span>{timeValidation.durationText}</span>
              </div>
            )}
          </div>

          {/* Tujuan */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Tujuan penggunaan
            </Label>
            <Textarea
              placeholder="contoh: Meeting Project Q3"
              rows={3}
              value={form.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            size="sm"
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Mengajukan..." : "Ajukan booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBookingModal;
