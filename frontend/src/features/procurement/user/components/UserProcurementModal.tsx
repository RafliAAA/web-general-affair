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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateProcurementPayload } from "@/types/procurement";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateProcurementPayload) => Promise<void>;
  endUser: string;
  isSubmitting: boolean;
}

const emptyItem = {
  part_number: "",
  description: "",
  quantity: 1,
  unit_of_measure: "",
};

const initialForm: CreateProcurementPayload = {
  pr_date: "",
  due_date: "",
  end_user: "",
  remarks: "",
  actualization_id: "", // Dikosongkan karena ini kebutuhan baru
  items: [{ ...emptyItem }],
};

const unitOptions = ["PCS", "UNIT", "SET", "BOX", "PACK"];

const UserProcurementModal = ({
  open,
  onClose,
  onCreate,
  endUser,
  isSubmitting,
}: Props) => {
  const [form, setForm] = useState<CreateProcurementPayload>({
    ...initialForm,
    end_user: endUser,
  });

  const handleChange = (
    field: keyof CreateProcurementPayload,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value } as any;
      return { ...prev, items };
    });
  };

  const addItem = () =>
    setForm((prev) => ({ ...prev, items: [...prev.items, { ...emptyItem }] }));
  const removeItem = (index: number) =>
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));

  const handleSubmit = async () => {
    const isValid =
      form.pr_date &&
      form.due_date &&
      form.end_user &&
      form.items.every(
        (i) =>
          i.part_number && i.description && i.unit_of_measure && i.quantity > 0,
      );
    if (!isValid) return;

    try {
      await onCreate(form);
      setForm({ ...initialForm, end_user: endUser });
      onClose();
    } catch (error) {
      // Error sudah ditangani di hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Ajukan Pengadaan Baru
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">
                Tanggal PR
              </Label>
              <Input
                type="date"
                value={form.pr_date}
                onChange={(e) => handleChange("pr_date", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">
                Tanggal Jatuh Tempo
              </Label>
              <Input
                type="date"
                value={form.due_date}
                onChange={(e) => handleChange("due_date", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Keterangan (Opsional)
            </Label>
            <Textarea
              placeholder="Contoh: Kebutuhan laptop untuk karyawan baru"
              value={form.remarks || ""}
              onChange={(e) => handleChange("remarks", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">
                Item Pengadaan
              </Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addItem}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Tambah Item
              </Button>
            </div>

            {form.items.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border p-3 space-y-3 bg-muted/20"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    Item {index + 1}
                  </p>
                  {form.items.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-red-500 h-6 px-2"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Part Number</Label>
                    <Input
                      placeholder="LAP-MAC-01"
                      value={item.part_number}
                      onChange={(e) =>
                        handleItemChange(index, "part_number", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Satuan</Label>
                    <Select
                      value={item.unit_of_measure}
                      onValueChange={(val) =>
                        handleItemChange(index, "unit_of_measure", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih satuan" />
                      </SelectTrigger>
                      <SelectContent>
                        {unitOptions.map((u) => (
                          <SelectItem key={u} value={u}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-xs">Deskripsi</Label>
                    <Input
                      placeholder="Nama barang"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Qty</Label>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Ajukan PR"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProcurementModal;
