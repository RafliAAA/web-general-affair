import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import type { CreateProcurementPayload } from "../../../types/procurement";

interface Props {
  onCreate: (payload: CreateProcurementPayload) => Promise<unknown>;
}

const emptyItem = {
  part_number: "",
  description: "",
  quantity: 1,
  unit_of_measure: "",
};

const initialForm: CreateProcurementPayload = {
  pr_number: "",
  pr_date: "",
  print_date: "",
  due_date: "",
  end_user: "",
  remarks: "",
  items: [{ ...emptyItem }],
};

const CreateProcurementModal = ({ onCreate }: Props) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateProcurementPayload>(initialForm);
  const [loading, setLoading] = useState(false);

  const isValid =
    form.pr_number &&
    form.pr_date &&
    form.print_date &&
    form.due_date &&
    form.end_user &&
    form.items.length > 0 &&
    form.items.every(
      (i) => i.part_number && i.description && i.unit_of_measure,
    );

  const handleChange = (
    field: keyof CreateProcurementPayload,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (
    index: number,
    field: keyof (typeof form.items)[0],
    value: string | number,
  ) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, { ...emptyItem }] }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    try {
      setLoading(true);
      await onCreate(form);
      setForm(initialForm);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          Tambah PR
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Tambah purchase request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* PR Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Nomor PR</Label>
              <Input
                placeholder="PR-2026-001"
                value={form.pr_number}
                onChange={(e) => handleChange("pr_number", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">End user</Label>
              <Input
                placeholder="Nama - Departemen"
                value={form.end_user}
                onChange={(e) => handleChange("end_user", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
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
                Tanggal cetak
              </Label>
              <Input
                type="date"
                value={form.print_date}
                onChange={(e) => handleChange("print_date", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">
                Tanggal jatuh tempo
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
              Keterangan{" "}
              <span className="text-muted-foreground/60">(opsional)</span>
            </Label>
            <Textarea
              placeholder="Keterangan pengadaan..."
              value={form.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              rows={2}
            />
          </div>

          {/* Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">
                Item pengadaan
              </Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addItem}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Tambah item
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
                      className="text-red-500 hover:text-red-600 h-6 px-2"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Part number
                    </Label>
                    <Input
                      placeholder="LAP-MAC-01"
                      value={item.part_number}
                      onChange={(e) =>
                        handleItemChange(index, "part_number", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Satuan
                    </Label>
                    <Input
                      placeholder="UNIT / PCS / SET"
                      value={item.unit_of_measure}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "unit_of_measure",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Deskripsi
                    </Label>
                    <Input
                      placeholder="Nama barang"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Qty</Label>
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

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setForm(initialForm);
              setOpen(false);
            }}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            size="sm"
            disabled={!isValid || loading}
            onClick={handleSubmit}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProcurementModal;
