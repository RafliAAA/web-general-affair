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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BorrowRequest, CreateReturnPayload } from "../services/returnService";

interface Props {
  borrow: BorrowRequest;
  onConfirm: (payload: CreateReturnPayload) => void;
  onClose: () => void;
  loading: boolean;
}

const KONDISI_OPTIONS = ["Baik", "Cukup", "Rusak"] as const;

const ReturnModal = ({ borrow, onConfirm, onClose, loading }: Props) => {
  const [condition, setCondition] = useState<"Baik" | "Cukup" | "Rusak" | "">("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!condition) return;
    onConfirm({
      borrow_id: borrow.borrow_id,
      return_condition: condition,
      notes: notes || undefined,
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Konfirmasi pengembalian
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Info Peminjaman */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <p className="text-sm font-medium">{borrow.asset.asset_name}</p>
            <p className="text-xs text-muted-foreground">
              {borrow.asset.serial_number} · {borrow.asset.asset_type}
            </p>
            <p className="text-xs text-muted-foreground">
              Dipinjam oleh{" "}
              <span className="font-medium text-foreground">
                {borrow.user?.profile?.name ?? "—"}
              </span>
            </p>
          </div>

          {/* Kondisi Pengembalian */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Kondisi aset saat dikembalikan
            </Label>
            <Select
              value={condition}
              onValueChange={(val) => setCondition(val as typeof condition)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kondisi" />
              </SelectTrigger>
              <SelectContent>
                {KONDISI_OPTIONS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Catatan */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Catatan{" "}
              <span className="text-muted-foreground/60">(opsional)</span>
            </Label>
            <Textarea
              placeholder="contoh: Layar ada goresan kecil"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            size="sm"
            disabled={!condition || loading}
            onClick={handleSubmit}
          >
            {loading ? "Memproses..." : "Konfirmasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnModal;