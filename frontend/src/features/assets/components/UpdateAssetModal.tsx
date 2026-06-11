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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { Asset } from "../../../types/inventory";

interface Props {
  asset: Asset;
  onUpdate: (id: string, data: Partial<Asset>) => void;
  onClose: () => void;
}

const KATEGORI_OPTIONS = ["Laptop", "Handphone", "Kamera", "Mobil"];
const KONDISI_OPTIONS = ["Baik", "Cukup", "Rusak"];

const UpdateAssetModal = ({ asset, onUpdate, onClose }: Props) => {
  const [form, setForm] = useState({
    asset_name: asset.asset_name,
    asset_code: asset.asset_code,
    serial_number: asset.serial_number,
    asset_type: asset.asset_type,
    condition: asset.condition,
    warranty_date: asset.warranty_date
      ? new Date(asset.warranty_date).toISOString().split("T")[0]
      : "",
    purchase_date: asset.purchase_date
      ? new Date(asset.purchase_date).toISOString().split("T")[0]
      : "",
  });

  const isValid =
    form.asset_name &&
    form.asset_code &&
    form.serial_number &&
    form.asset_type &&
    form.condition;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onUpdate(asset.asset_id, {
      ...form,
      purchase_date: form.purchase_date
        ? new Date(form.purchase_date).toISOString()
        : null,
      warranty_date: form.warranty_date
        ? new Date(form.warranty_date).toISOString()
        : null,
    } as Partial<Asset>);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">Edit aset</DialogTitle>
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
          <Button variant="outline" size="sm" onClick={onClose}>
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

export default UpdateAssetModal;
