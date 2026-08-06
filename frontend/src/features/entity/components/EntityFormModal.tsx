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
import type { Entity } from "../services/entityService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { entity_name: string }) => Promise<void>;
  initialData: Entity | null;
}

const EntityFormModal = ({ open, onClose, onSubmit, initialData }: Props) => {
  const [entityName, setEntityName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setEntityName(initialData?.entity_name || "");
    }
  }, [open, initialData]);

  const handleSubmit = async () => {
    if (!entityName) return;
    setLoading(true);
    try {
      await onSubmit({ entity_name: entityName });
      onClose();
    } catch (error) {
      console.error("Error saving entity", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Entity" : "Tambah Entity"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="entity_name">Nama Entity (Perusahaan)</Label>
            <Input
              id="entity_name"
              placeholder="Misal: PT Syaamil Group"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
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

export default EntityFormModal;
