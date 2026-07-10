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
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import type { Room, CreateRoomPayload } from "../services/roomsService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateRoomPayload) => Promise<void>;
  isSubmitting: boolean;
  room?: Room | null; // kalau ada = mode edit
}

const initialForm = {
  name: "",
  capacity: 1,
  location: "",
};

const RoomFormModal = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  room,
}: Props) => {
  const [form, setForm] = useState(initialForm);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [facilityInput, setFacilityInput] = useState("");

  useEffect(() => {
    if (room) {
      setForm({
        name: room.name,
        capacity: room.capacity,
        location: room.location,
      });
      setFacilities(room.facilities.map((f) => f.name));
    } else {
      setForm(initialForm);
      setFacilities([]);
    }
  }, [room, open]);

  const handleChange = (
    field: keyof typeof initialForm,
    value: string | number,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addFacility = () => {
    const trimmed = facilityInput.trim();
    if (!trimmed || facilities.includes(trimmed)) return;
    setFacilities((prev) => [...prev, trimmed]);
    setFacilityInput("");
  };

  const removeFacility = (name: string) => {
    setFacilities((prev) => prev.filter((f) => f !== name));
  };

  const isValid = form.name && form.capacity > 0 && form.location;

  const handleSubmit = async () => {
    if (!isValid) return;
    await onSubmit({ ...form, facilities });
    setForm(initialForm);
    setFacilities([]);
  };

  const handleClose = () => {
    setForm(initialForm);
    setFacilities([]);
    setFacilityInput("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            {room ? "Edit ruangan" : "Tambah ruangan"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Nama ruangan
            </Label>
            <Input
              placeholder="contoh: Meeting Room A"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Kapasitas</Label>
              <Input
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) =>
                  handleChange("capacity", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Lokasi</Label>
              <Input
                placeholder="contoh: Lantai 2"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>
          </div>

          {/* Fasilitas */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Fasilitas{" "}
              <span className="text-muted-foreground/60">(opsional)</span>
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="contoh: Projector"
                value={facilityInput}
                onChange={(e) => setFacilityInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addFacility())
                }
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFacility}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {facilities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {facilities.map((f) => (
                  <Badge key={f} variant="secondary" className="gap-1">
                    {f}
                    <button
                      type="button"
                      onClick={() => removeFacility(f)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            size="sm"
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoomFormModal;
