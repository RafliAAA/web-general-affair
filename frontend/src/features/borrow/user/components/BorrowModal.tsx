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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { conditionVariant } from "@/lib/utils";
import type { Asset } from "../../../../types/inventory";

interface Props {
  asset: Asset;
  onConfirm: (
    borrow_reason: string,
    borrow_date: string,
    expected_return_date: string,
    recipient_type: "Personal" | "Divisi",
  ) => void;
  onClose: () => void;
  loading: boolean;
}

const today = new Date().toISOString().split("T")[0];

const BorrowModal = ({ asset, onConfirm, onClose, loading }: Props) => {
  const [borrow_reason, setBorrowReason] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [borrowDate, setBorrowDate] = useState("");
  const [recipientType, setRecipientType] = useState<"Personal" | "Divisi">(
    "Personal",
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Ajukan peminjaman
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Info Aset */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <p className="text-sm font-medium">{asset.asset_name}</p>
            <p className="text-xs text-muted-foreground">
              {asset.asset_code} · {asset.asset_category?.category_name || "—"}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground">Kondisi</span>
              <Badge
                variant={conditionVariant(asset.condition)}
                className="text-xs"
              >
                {asset.condition}
              </Badge>
            </div>
          </div>

          {/* Jenis Peminjam */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Jenis Peminjam
            </Label>
            <Select
              value={recipientType}
              onValueChange={(val) => setRecipientType(val as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis peminjaman" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Personal">Personal (Individu)</SelectItem>
                <SelectItem value="Divisi">Divisi / Departemen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Tanggal peminjaman
            </Label>
            <Input
              type="date"
              min={today}
              value={borrowDate}
              onChange={(e) => setBorrowDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Keperluan</Label>
            <Input
              value={borrow_reason}
              onChange={(e) => setBorrowReason(e.target.value)}
              placeholder="Masukkan keperluan peminjaman..."
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Rencana tanggal pengembalian
            </Label>
            <Input
              type="date"
              min={today}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            size="sm"
            disabled={!returnDate || !borrowDate || loading}
            onClick={() =>
              onConfirm(
                borrow_reason,
                borrowDate,
                new Date(returnDate).toISOString(),
                recipientType,
              )
            }
          >
            {loading ? "Mengajukan..." : "Ajukan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowModal;
