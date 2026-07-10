import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { CreateRoomPayload, Room, UpdateRoomPayload } from "@/types/rooms";

const roomSchema = z.object({
  name: z.string().min(1, "Nama ruangan wajib diisi"),
  capacity: z.number().int().positive("Kapasitas harus lebih dari 0"),
  location: z.string().min(1, "Lokasi wajib diisi"),
  status: z.enum(["Tersedia", "TidakTersedia"]).optional(),
});

type RoomFormValues = z.infer<typeof roomSchema>;

interface RoomFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateRoomPayload | UpdateRoomPayload) => void;
  isSubmitting: boolean;
  room?: Room | null;
}

const RoomFormDialog = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  room,
}: RoomFormDialogProps) => {
  const isEdit = !!room;
  const [facilityInput, setFacilityInput] = useState("");
  const [facilities, setFacilities] = useState<string[]>(
    () => room?.facilities.map((f) => f.name) ?? []
  );

  const form = useForm<RoomFormValues, unknown, RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      capacity: 1,
      location: "",
    },
  });

useEffect(() => {
  if (room) {
    form.reset({
      name: room.name,
      capacity: room.capacity,
      location: room.location,
      status: room.status,
    });

    setFacilities(room.facilities.map((f) => f.name));
  } else {
    form.reset({
      name: "",
      capacity: 1,
      location: "",
    });

    setFacilities([]);
  }
}, [room, form]);

  const handleAddFacility = () => {
    const trimmed = facilityInput.trim();
    if (!trimmed || facilities.includes(trimmed)) return;
    setFacilities((prev) => [...prev, trimmed]);
    setFacilityInput("");
  };

  const handleRemoveFacility = (name: string) => {
    setFacilities((prev) => prev.filter((f) => f !== name));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFacility();
    }
  };

  const handleSubmit = (values: RoomFormValues) => {
    onSubmit({ ...values, facilities });
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    setFacilities([]);
    setFacilityInput("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Ruangan" : "Tambah Ruangan"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Ruangan</FormLabel>
                  <FormControl>
                    <Input placeholder="cth: Meeting Room A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kapasitas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="cth: 10"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi</FormLabel>
                    <FormControl>
                      <Input placeholder="cth: Lantai 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isEdit && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Tersedia">Tersedia</SelectItem>
                        <SelectItem value="TidakTersedia">Tidak Tersedia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Separator />

            <div className="space-y-2">
              <FormLabel>Fasilitas</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="cth: Proyektor"
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddFacility}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {facilities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {facilities.map((f) => (
                    <Badge key={f} variant="secondary" className="gap-1 pr-1">
                      {f}
                      <button
                        type="button"
                        onClick={() => handleRemoveFacility(f)}
                        className="ml-0.5 hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Ruangan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomFormDialog;