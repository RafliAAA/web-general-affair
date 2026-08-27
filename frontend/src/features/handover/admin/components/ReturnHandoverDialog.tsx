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
import { Badge } from "@/components/ui/badge";
import { Clock, User, Package } from "lucide-react";
import type {
  Handover,
  CreateHandoverReturnPayload,
} from "@/types/handover"; 

interface Props {
  handover: Handover | null;
  onConfirm: (payload: CreateHandoverReturnPayload) => void;
  onClose: () => void;
  loading: boolean;
}

const ReturnHandoverModal = ({
  handover,
  onConfirm,
  onClose,
  loading,
}: Props) => {
  const [returnCondition, setReturnCondition] = useState("Baik");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    onConfirm({
      handover_id: handover?.handover_id || "",
      return_condition: returnCondition as any, 
      notes: notes,
    });
  };

  if (!handover) return null;

  return (
    <Dialog open={!!handover} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Pengembalian Aset (Handover)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Info Handover (Clean Card Design) */}
          <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-base text-foreground">
                {handover.receiver?.profile?.name || "Unknown"}
              </h3>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                {handover.status}
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                Tanggal Serah Terima:{" "}
                <span className="font-medium text-foreground">
                  {new Date(handover.handover_date).toLocaleDateString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <User className="h-4 w-4 shrink-0" />
                Penerima:{" "}
                <span className="font-medium text-foreground">
                  {handover.receiver?.profile?.name || "-"}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Package className="h-4 w-4 shrink-0" />
                Jumlah Aset:{" "}
                <span className="font-medium text-foreground">
                  {handover.items?.length || 0} Item
                </span>
              </p>
            </div>
          </div>

          {/* Pilih Kondisi Aset */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Kondisi Aset
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg border-2 transition-all text-sm ${returnCondition === "Baik" ? "border-green-500 bg-green-50 text-green-700 font-semibold" : "border-border hover:border-green-500/50 hover:bg-muted/50 text-foreground"}`}
                onClick={() => setReturnCondition("Baik")}
              >
                Baik
              </button>
              <button
                type="button"
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg border-2 transition-all text-sm ${returnCondition === "Cukup" ? "border-yellow-500 bg-yellow-50 text-yellow-700 font-semibold" : "border-border hover:border-yellow-500/50 hover:bg-muted/50 text-foreground"}`}
                onClick={() => setReturnCondition("Cukup")}
              >
                Cukup
              </button>
              <button
                type="button"
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg border-2 transition-all text-sm ${returnCondition === "Rusak" ? "border-red-500 bg-red-50 text-red-700 font-semibold" : "border-border hover:border-red-500/50 hover:bg-muted/50 text-foreground"}`}
                onClick={() => setReturnCondition("Rusak")}
              >
                Rusak
              </button>
            </div>
          </div>

          {/* Catatan Pengembalian */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Catatan{" "}
              <span className="text-muted-foreground/60">(opsional)</span>
            </Label>
            <Textarea
              placeholder="Contoh: Aset dikembalikan dalam keadaan lecet..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Memproses..." : "Konfirmasi Pengembalian"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnHandoverModal;
