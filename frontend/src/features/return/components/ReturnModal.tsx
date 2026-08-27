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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 
import { Clock, Package } from "lucide-react";
import type { CreateReturnPayload } from "../services/returnService";

interface ReturnTarget {
  borrow_id?: string;
  handover_id?: string;
  user?: { profile?: { name?: string | null } | null } | null;
  borrow_date?: string;
  asset?: { asset_name?: string } | null;
  receiver?: { profile?: { name?: string | null } | null } | null;
  handover_date?: string;
  items?: any[];
}

interface Props {
  target: ReturnTarget | null;
  onConfirm: (payload: CreateReturnPayload) => void;
  onClose: () => void;
  loading: boolean;
}

const ReturnModal = ({ target, onConfirm, onClose, loading }: Props) => {
  const [condition, setCondition] = useState<string>("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!condition || !target) return;

    const payload: CreateReturnPayload = {
      return_condition: condition as any,
      notes: notes || undefined,
    };

    if (target.borrow_id) {
      payload.borrow_id = target.borrow_id;
    } else if (target.handover_id) {
      payload.handover_id = target.handover_id;
    }

    onConfirm(payload);
  };

  if (!target) return null;

  const personName =
    target.user?.profile?.name || target.receiver?.profile?.name || "Unknown";
  const dateStr = target.borrow_date || target.handover_date || "";
  const assetInfo = target.borrow_id
    ? `Aset: ${target.asset?.asset_name || "-"}`
    : `Jumlah Aset: ${target.items?.length || 0} Item`;

  return (
    <Dialog open={!!target} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Konfirmasi Pengembalian
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Info Pengembalian (Clean Card Design) */}
          <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-base text-foreground">
                {personName}
              </h3>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 capitalize"
              >
                {target.borrow_id ? "Borrow" : "Handover"}
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                {dateStr
                  ? new Date(dateStr).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </p>
              <p className="flex items-center gap-2">
                <Package className="h-4 w-4 shrink-0" />
                {assetInfo}
              </p>
            </div>
          </div>

          {/* Pilih Kondisi Aset (Dropdown) */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Kondisi aset saat dikembalikan
            </Label>
            <Select
              value={condition}
              onValueChange={(val) => setCondition(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kondisi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baik">Baik</SelectItem>
                <SelectItem value="Rusak">Rusak</SelectItem>
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
              placeholder="Contoh: Layar ada goresan kecil"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
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
            disabled={!condition || loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Memproses..." : "Konfirmasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnModal;
