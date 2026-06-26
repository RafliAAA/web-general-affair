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
import { updateDisposal } from "../services/disposalService";
import type {
  Disposal,
  DisposalItemPayload,
} from "../services/disposalService";

interface Props {
  disposal: Disposal;
  onUpdate: (updated: Disposal) => void;
  onClose: () => void;
}

const toDateInput = (dateStr: string) =>
  new Date(dateStr).toISOString().split("T")[0];

const UpdateDisposalMemoModal = ({ disposal, onUpdate, onClose }: Props) => {
  const [form, setForm] = useState({
  memo_number: disposal.memo_number ?? "",
  memo_date: disposal.memo_date ? toDateInput(disposal.memo_date) : "",
  subject: disposal.subject ?? "",
  description: disposal.description ?? "",
});
  const [loading, setLoading] = useState(false);

  const isValid = form.memo_number && form.memo_date && form.subject;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    try {
      setLoading(true);

      const existingItems: DisposalItemPayload[] =
        disposal.items?.map((i) => ({
          asset_id: i.asset_id,
          method: i.method,
          notes: i.notes,
        })) ?? [];

      const updated = await updateDisposal(disposal.disposal_id, {
        memo_number: form.memo_number ?? "",
        memo_date: new Date(form.memo_date).toISOString(),
        subject: form.subject ?? "",
        description: form.description ?? "",
        items: existingItems,
      });

      onUpdate(updated);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Edit memo disposal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Nomor memo</Label>
            <Input
              value={form.memo_number}
              onChange={(e) => handleChange("memo_number", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Tanggal memo
            </Label>
            <Input
              type="date"
              value={form.memo_date}
              onChange={(e) => handleChange("memo_date", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Subjek</Label>
            <Input
              value={form.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Deskripsi{" "}
              <span className="text-muted-foreground/60">(opsional)</span>
            </Label>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
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
            disabled={!isValid || loading}
            onClick={handleSubmit}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDisposalMemoModal;
