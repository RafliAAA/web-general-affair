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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CannotRepairPayload } from "@/types/maintenance";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CannotRepairPayload) => Promise<void>;
}

const CannotRepairModal = ({ open, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState<CannotRepairPayload>({
    form_number: "",
    description: "",
    issue: "",
    handling: "",
    recommendation: "",
  });
  const [loading, setLoading] = useState(false);

  const isValid = Object.values(form).every((v) => v.trim() !== "");

  const handleChange = (field: keyof CannotRepairPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setForm({
      form_number: "",
      description: "",
      issue: "",
      handling: "",
      recommendation: "",
    });
    onClose();
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    try {
      setLoading(true);
      await onSubmit(form);
      handleClose();
    } catch {
      // error handled in hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Form Aktualisasi — Tidak Dapat Diperbaiki
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Nomor form</Label>
            <Input
              placeholder="SVC24110023"
              value={form.form_number}
              onChange={(e) => handleChange("form_number", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Keterangan</Label>
            <Textarea
              placeholder="Deskripsi kerusakan..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Kendala</Label>
            <Textarea
              placeholder="Kendala yang ditemukan..."
              value={form.issue}
              onChange={(e) => handleChange("issue", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Penanganan</Label>
            <Textarea
              placeholder="Penanganan yang dilakukan..."
              value={form.handling}
              onChange={(e) => handleChange("handling", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Rekomendasi</Label>
            <Textarea
              placeholder="Rekomendasi tindak lanjut..."
              value={form.recommendation}
              onChange={(e) => handleChange("recommendation", e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={!isValid || loading}
            onClick={handleSubmit}
          >
            {loading ? "Menyimpan..." : "Tandai Tidak Dapat Diperbaiki"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CannotRepairModal;
