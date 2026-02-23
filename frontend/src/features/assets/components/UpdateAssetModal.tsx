import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import type { Asset } from "../../../types/inventory";
import { Button } from "@/components/ui/button";

interface Props {
  asset: Asset;
  onUpdate: (id: string, data: Partial<Asset>) => void;
  onClose: () => void;
}

const UpdateAssetModal = ({ asset, onUpdate, onClose }: Props) => {
  const [form, setForm] = useState<Partial<Asset>>(asset);

  const handleSubmit = () => {
    onUpdate(asset.asset_id, form);
    onClose(); // tutup modal setelah simpan
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Aset</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Nama Aset"
            value={form.asset_name || ""}
            onChange={(e) => setForm({ ...form, asset_name: e.target.value })}
          />
          <Input
            placeholder="Kategori"
            value={form.asset_type || ""}
            onChange={(e) => setForm({ ...form, asset_type: e.target.value })}
          />
          <Input
            placeholder="Kode Aset"
            value={form.serial_number || ""}
            onChange={(e) =>
              setForm({ ...form, serial_number: e.target.value })
            }
          />
          <Input
            placeholder="Lokasi"
            value={form.location || ""}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleSubmit}>Simpan</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAssetModal;
