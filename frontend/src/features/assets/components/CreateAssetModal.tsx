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
import { Textarea } from "@/components/ui/textarea"; // 🌟 IMPORT TEXTAREA
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../../lib/axios";
import type { Asset } from "../../../types/inventory";

interface AssetCategory {
  asset_category_id: string;
  category_name: string;
  category_code: string;
}

interface Props {
  onCreate: (data: Asset) => void;
}

const KONDISI_OPTIONS = ["Baik", "Rusak"];

const initialForm = {
  asset_name: "",
  serial_number: "",
  specification: "", 
  asset_category_id: "",
  condition: "",
  purchase_date: "",
  warranty_date: "",
};

const CreateAssetModal = ({ onCreate }: Props) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const res = await api.get("/assets/categories");
        setCategories(res.data.data);
      } catch {
        // silent fail
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [open]);

  const isValid =
    form.asset_name &&
    form.serial_number &&
    form.asset_category_id &&
    form.condition &&
    form.purchase_date;

  const handleSubmit = () => {
    if (!isValid) return;
    onCreate({
      ...form,
      purchase_date: new Date(form.purchase_date).toISOString(),
      warranty_date: form.warranty_date
        ? new Date(form.warranty_date).toISOString()
        : null,
    } as unknown as Asset);
    setForm(initialForm);
    setOpen(false);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          Tambah aset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Tambah aset baru
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Nama Aset */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Nama aset</Label>
            <Input
              placeholder="contoh: Laptop Dell XPS 13"
              value={form.asset_name}
              onChange={(e) => handleChange("asset_name", e.target.value)}
            />
          </div>

          {/* Serial Number */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Serial number
            </Label>
            <Input
              placeholder="ABC-123456"
              value={form.serial_number}
              onChange={(e) => handleChange("serial_number", e.target.value)}
            />
          </div>

          {/* Spesifikasi Aset 🌟 */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Spesifikasi{" "}
              <span className="text-muted-foreground/60"></span>
            </Label>
            <Textarea
              placeholder="Contoh: Intel Core i5, 8GB RAM, 256GB SSD"
              value={form.specification}
              onChange={(e) => handleChange("specification", e.target.value)}
              rows={3}
            />
          </div>

          {/* Kategori & Kondisi */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Kategori</Label>
              <div className="flex gap-2">
                <Select
                  value={form.asset_category_id}
                  onValueChange={(val) =>
                    handleChange("asset_category_id", val)
                  }
                  disabled={isLoadingCategories}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue
                      placeholder={
                        isLoadingCategories ? "Memuat..." : "Pilih kategori"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.asset_category_id}
                        value={cat.asset_category_id}
                      >
                        {cat.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Kondisi</Label>
              <Select
                value={form.condition}
                onValueChange={(val) => handleChange("condition", val)}
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
          </div>

          {/* Tanggal Pembelian */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Tanggal pembelian
            </Label>
            <Input
              type="date"
              value={form.purchase_date}
              onChange={(e) => handleChange("purchase_date", e.target.value)}
            />
          </div>

          {/* Tanggal Garansi */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Tanggal garansi{" "}
              <span className="text-muted-foreground/60">(opsional)</span>
            </Label>
            <Input
              type="date"
              value={form.warranty_date}
              onChange={(e) => handleChange("warranty_date", e.target.value)}
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
          >
            Batal
          </Button>
          <Button size="sm" disabled={!isValid} onClick={handleSubmit}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssetModal;
