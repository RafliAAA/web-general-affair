import { useState } from "react";
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
import { completeMaintenanceExternal } from "../services/maintenanceService";

interface Props {
  open: boolean;
  onClose: () => void;
  maintenanceId: string;
  onSuccess: () => void;
}

const CompleteExternalModal = ({
  open,
  onClose,
  maintenanceId,
  onSuccess,
}: Props) => {
  const [externalNotes, setExternalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await completeMaintenanceExternal(maintenanceId, externalNotes);
      toast.success("Maintenance berhasil diselesaikan!");
      setExternalNotes(""); // Reset input
      onSuccess(); // Trigger redirect/refetch
    } catch (error) {
      toast.error("Gagal menyelesaikan maintenance");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Selesai dari Vendor</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="external_notes">
            Catatan Penyelesaian
          </Label>
          <Input
            id="external_notes"
            value={externalNotes}
            onChange={(e) => setExternalNotes(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Pastikan aset fisik sudah kembali dari vendor dan dalam kondisi baik
            sebelum menekan konfirmasi.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Konfirmasi Selesai"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteExternalModal;
