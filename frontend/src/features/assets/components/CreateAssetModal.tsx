import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { Asset } from "../../../types/inventory";

interface Props {
  onCreate: (data: Asset) => void;
}

const CreateAssetModal = ({ onCreate }: Props) => {
  const [form, setForm] = useState<Partial<Asset>>({});

  const handleSubmit = () => {
    onCreate(form as Asset);
    setForm({});
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="h-4 w-4 mr-2" /> Tambah Aset
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Aset Baru</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            className="border border-secondary"
            placeholder="Nama Aset"
            value={form.asset_name || ""}
            onChange={(e) => setForm({ ...form, asset_name: e.target.value })}
          />
          <Input
            className="border border-secondary"
            placeholder="Kategori"
            value={form.asset_type || ""}
            onChange={(e) => setForm({ ...form, asset_type: e.target.value })}
          />
          <Input
            className="border border-secondary"
            placeholder="Kode Aset"
            value={form.serial_number || ""}
            onChange={(e) =>
              setForm({ ...form, serial_number: e.target.value })
            }
          />
          <Input
            className="border border-secondary"
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

export default CreateAssetModal;
