import { useState } from "react";
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
import type {
  BookingRoom,
  CreateBookingPayload,
} from "../services/bookingService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateBookingPayload) => Promise<void>;
  isSubmitting: boolean;
  room: BookingRoom | null;
}

const today = new Date().toISOString().split("T")[0];

const CreateBookingModal = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  room,
}: Props) => {
  const [form, setForm] = useState({
    date: today,
    start_time: "",
    end_time: "",
    purpose: "",
  });

  const isValid = form.date && form.start_time && form.end_time && form.purpose;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!isValid || !room) return;
    await onSubmit({
      room_id: room.room_id,
      ...form,
    });
    setForm({ date: today, start_time: "", end_time: "", purpose: "" });
    onClose();
  };

  const handleClose = () => {
    setForm({ date: today, start_time: "", end_time: "", purpose: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Ajukan booking ruangan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Info Ruangan */}
          {room && (
            <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
              <p className="text-sm font-medium">{room.name}</p>
              <p className="text-xs text-muted-foreground">
                {room.location} · {room.capacity} orang
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Tanggal</Label>
            <Input
              type="date"
              min={today}
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Mulai</Label>
              <Input
                type="time"
                value={form.start_time}
                onChange={(e) => handleChange("start_time", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Selesai</Label>
              <Input
                type="time"
                value={form.end_time}
                onChange={(e) => handleChange("end_time", e.target.value)}
              />
            </div>
          </div>

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
            onClick={handleClose}
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
