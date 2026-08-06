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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Entity } from "../../entity/services/entityService";
import type { Directorate } from "../services/directorateService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    directorate_name: string;
    entity_id: string;
  }) => Promise<void>;
  initialData: Directorate | null;
  entities: Entity[];
}

const DirectorateFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  entities,
}: Props) => {
  const [directorateName, setDirectorateName] = useState("");
  const [entityId, setEntityId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setDirectorateName(initialData?.directorate_name || "");
      setEntityId(initialData?.entity_id || "");
    }
  }, [open, initialData]);

  const handleSubmit = async () => {
    if (!directorateName || !entityId) return;
    setLoading(true);
    try {
      await onSubmit({
        directorate_name: directorateName,
        entity_id: entityId,
      });
      onClose();
    } catch (error) {
      console.error("Error saving directorate", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Direktorat" : "Tambah Direktorat"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="entity">Entity (Perusahaan)</Label>
            <Select value={entityId} onValueChange={setEntityId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Entity" />
              </SelectTrigger>
              <SelectContent>
                {entities.map((ent) => (
                  <SelectItem key={ent.entity_id} value={ent.entity_id}>
                    {ent.entity_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="directorate_name">Nama Direktorat</Label>
            <Input
              id="directorate_name"
              placeholder="Misal: Direktorat IT"
              value={directorateName}
              onChange={(e) => setDirectorateName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !entityId}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DirectorateFormModal;
