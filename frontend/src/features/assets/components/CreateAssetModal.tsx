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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { Asset } from "../../../types/inventory";

interface Props {
  onCreate: (data: Asset) => void;
}

const KATEGORI_OPTIONS = ["Laptop", "Handphone", "Kamera", "Mobil"];
const KONDISI_OPTIONS = ["Baik", "Cukup", "Rusak"];

const initialForm = {
  asset_name: "",
  asset_code: "",
  serial_number: "",
  asset_type: "",
  condition: "",
  purchase_date: "",
  warranty_date: "",
};

const CreateAssetModal = ({ onCreate }: Props) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const isValid =
    form.asset_name &&
    form.asset_code &&
    form.serial_number &&
    form.asset_type &&
    form.condition;

  const handleSubmit = () => {
    if (!isValid) return;
    onCreate({
      ...form,
      purchase_date: form.purchase_date
        ? new Date(form.purchase_date).toISOString()
        : null,
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

          {/* Kode Aset & Serial Number */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Kode aset</Label>
              <Input
                placeholder="AST-00001"
                value={form.asset_code}
                onChange={(e) => handleChange("asset_code", e.target.value)}
              />
            </div>
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
          </div>

          {/* Kategori & Kondisi */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Kategori</Label>
              <Select
                value={form.asset_type}
                onValueChange={(val) => handleChange("asset_type", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {KATEGORI_OPTIONS.map((k) => (
                    <SelectItem key={k} value={k}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              Tanggal pembelian{" "}
              <span className="text-muted-foreground/60">(opsional)</span>
            </Label>
            <Input
              type="date"
              value={form.purchase_date}
              onChange={(e) => handleChange("purchase_date", e.target.value)}
            />
          </div>
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