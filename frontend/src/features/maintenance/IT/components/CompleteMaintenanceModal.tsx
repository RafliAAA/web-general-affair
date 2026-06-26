import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (resolution_notes: string) => Promise<void>;
}

const CompleteMaintenanceModal = ({ open, onClose, onSubmit }: Props) => {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setNotes("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!notes.trim()) return;
    try {
      setLoading(true);
      await onSubmit(notes);
      handleClose();
    } catch {
      // error handled in hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Selesaikan maintenance
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Catatan penyelesaian
            </Label>
            <Textarea
              placeholder="Jelaskan apa yang sudah dilakukan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            size="sm"
            disabled={!notes.trim() || loading}
            onClick={handleSubmit}
          >
            {loading ? "Menyimpan..." : "Selesaikan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteMaintenanceModal;