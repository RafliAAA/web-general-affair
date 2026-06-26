import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import type { Disposal } from "../services/disposalService";

interface Props {
  onCreate: (payload: {
    memo_number: string;
    memo_date: string;
    subject: string;
    description: string;
    items: [];
  }) => Promise<Disposal>;
  onCreated: (disposal: Disposal) => void;
}

const initialForm = {
  memo_number: "",
  memo_date: "",
  subject: "",
  description: "",
};

const CreateDisposalModal = ({ onCreate, onCreated }: Props) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const isValid = form.memo_number && form.memo_date && form.subject;

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    try {
      setLoading(true);
      const created = await onCreate({ ...form, items: [] });
      setForm(initialForm);
      setOpen(false);
      onCreated(created);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          Buat disposal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Buat memo disposal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Nomor memo</Label>
            <Input
              placeholder="INT/0001/IM/HCGA/SYAAMILGROUP/01/2026"
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
              placeholder="Disposal aset..."
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
              placeholder="Alasan atau tujuan disposal..."
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
            onClick={() => {
              setForm(initialForm);
              setOpen(false);
            }}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            size="sm"
            disabled={!isValid || loading}
            onClick={handleSubmit}
          >
            {loading ? "Menyimpan..." : "Simpan & lanjut"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDisposalModal;
