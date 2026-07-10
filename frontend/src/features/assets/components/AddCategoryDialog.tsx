import { useState } from "react";
import { Plus } from "lucide-react";
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
import { toast } from "sonner";
import api from "../../../lib/axios";

interface AssetCategory {
  asset_category_id: string;
  category_name: string;
  category_code: string;
}

interface Props {
  onCreated: (category: AssetCategory) => void;
}

const AddCategoryDialog = ({ onCreated }: Props) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ category_name: "", category_code: "" });

  const isValid = form.category_name && form.category_code;

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      const res = await api.post("/assets/categories", form);
      toast.success("Kategori berhasil ditambahkan");
      onCreated(res.data.data);
      setForm({ category_name: "", category_code: "" });
      setOpen(false);
    } catch {
      toast.error("Gagal menambahkan kategori");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0"
        onClick={() => setOpen(true)}
        title="Tambah kategori baru"
      >
        <Plus className="w-4 h-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-base font-medium">
              Tambah kategori
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">
                Nama kategori
              </Label>
              <Input
                placeholder="cth: Laptop"
                value={form.category_name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category_name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">
                Kode kategori
              </Label>
              <Input
                placeholder="cth: 01"
                value={form.category_code}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category_code: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button
              size="sm"
              disabled={!isValid || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddCategoryDialog;