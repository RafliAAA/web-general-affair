import { useEffect, useState } from "react";
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
import type { AssetCategory } from "../services/categoryService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category_name: string;
    category_code: string;
  }) => Promise<void>;
  initialData: AssetCategory | null;
}

const CategoryFormModal = ({ open, onClose, onSubmit, initialData }: Props) => {
  const [form, setForm] = useState({ category_name: "", category_code: "" });
  const [loading, setLoading] = useState(false);

  // Isi form saat modal dibuka (untuk mode Edit)
  useEffect(() => {
    if (open) {
      setForm({
        category_name: initialData?.category_name || "",
        category_code: initialData?.category_code || "",
      });
    }
  }, [open, initialData]);

  const handleSubmit = async () => {
    if (!form.category_name || !form.category_code) return;
    try {
      setLoading(true);
      await onSubmit(form);
      onClose();
    } catch (error) {
      console.error("Gagal menyimpan kategori", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Kategori" : "Tambah Kategori"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Kategori</Label>
            <Input
              id="name"
              value={form.category_name}
              onChange={(e) =>
                setForm({ ...form, category_name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Kode Kategori</Label>
            <Input
              id="code"
              value={form.category_code}
              onChange={(e) =>
                setForm({
                  ...form,
                  category_code: e.target.value.toUpperCase(),
                })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormModal;
