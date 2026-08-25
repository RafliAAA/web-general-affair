import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  Booking,
  ReviewBookingPayload,
} from "@/types/booking";

interface Props {
  open: boolean;
  booking: Booking | null;
  onClose: () => void;
  onSubmit: (id: string, payload: ReviewBookingPayload) => Promise<void>;
  isSubmitting: boolean;
}

const ReviewBookingModal = ({
  open,
  booking,
  onClose,
  onSubmit,
  isSubmitting,
}: Props) => {
  const [rejectNotes, setRejectNotes] = useState("");
  const [action, setAction] = useState<"Disetujui" | "Ditolak" | null>(null);

  const handleSubmit = async () => {
    if (!booking || !action) return;
    await onSubmit(booking.booking_id, {
      status: action,
      reject_notes: action === "Ditolak" ? rejectNotes : undefined,
    });
    setRejectNotes("");
    setAction(null);
    onClose();
  };

  const handleClose = () => {
    setRejectNotes("");
    setAction(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Review booking
          </DialogTitle>
        </DialogHeader>

        {booking && (
          <div className="space-y-4 py-2">
            {/* Info Booking */}
            <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
              <p className="text-sm font-medium">{booking.room.name}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(booking.date).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}{" "}
                · {booking.start_time} – {booking.end_time}
              </p>
              <p className="text-xs text-muted-foreground">
                Diajukan oleh{" "}
                <span className="font-medium text-foreground">
                  {booking.user.profile.name}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Tujuan:{" "}
                <span className="font-medium text-foreground">
                  {booking.purpose}
                </span>
              </p>
            </div>

            {/* Pilih Aksi */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={action === "Disetujui" ? "default" : "outline"}
                size="sm"
                onClick={() => setAction("Disetujui")}
              >
                Setujui
              </Button>
              <Button
                variant={action === "Ditolak" ? "destructive" : "outline"}
                size="sm"
                onClick={() => setAction("Ditolak")}
              >
                Tolak
              </Button>
            </div>

            {/* Catatan penolakan */}
            {action === "Ditolak" && (
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">
                  Alasan penolakan{" "}
                  <span className="text-muted-foreground/60">(opsional)</span>
                </Label>
                <Textarea
                  placeholder="contoh: Ruangan sudah terisi"
                  rows={3}
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

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
            disabled={!action || isSubmitting}
            variant={action === "Ditolak" ? "destructive" : "default"}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Memproses..." : "Konfirmasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewBookingModal;
