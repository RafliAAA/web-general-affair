import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Plus, Trash2, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserSearch } from "../../user/hooks/useUserSearch";
import type {
  Procurement,
  CreateProcurementPayload,
} from "../../../types/procurement";

interface Props {
  procurement: Procurement;
  onUpdate: (
    id: string,
    payload: Partial<CreateProcurementPayload>,
  ) => Promise<unknown>;
  onClose: () => void;
}

const toDateInput = (dateStr: string) =>
  new Date(dateStr).toISOString().split("T")[0];

const unitOptions = ["PCS", "UNIT", "SET", "BOX", "PACK"];

const UpdateProcurementModal = ({ procurement, onUpdate, onClose }: Props) => {
  const [form, setForm] = useState<Omit<CreateProcurementPayload, "pr_number">>(
    {
      pr_date: toDateInput(procurement.pr_date),
      due_date: toDateInput(procurement.due_date),
      end_user: procurement.end_user,
      remarks: procurement.remarks,
      items: procurement.items?.map((i) => ({
        part_number: i.part_number,
        description: i.description,
        quantity: i.quantity,
        unit_of_measure: i.unit_of_measure,
        quantity_approved: i.quantity_approved,
        asset_category_id: i.asset_category_id || "",
        procurement_item_id: i.procurement_item_id,
      })) ?? [
        {
          part_number: "",
          description: "",
          quantity: 1,
          unit_of_measure: "",
          quantity_approved: 0,
          asset_category_id: "",
        },
      ],
    },
  );

  const [loading, setLoading] = useState(false);
  const [endUserPopoverOpen, setEndUserPopoverOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { users, isSearching, searchUsers } = useUserSearch();

  useEffect(() => {
    if (keyword.trim().length < 2) return;
    searchUsers(keyword);
  }, [keyword, searchUsers]);

  const isValid =
    form.pr_date &&
    form.due_date &&
    form.end_user &&
    form.items.length > 0 &&
    form.items.every(
      (i) =>
        i.part_number && i.description && i.unit_of_measure && i.quantity > 0,
    );

  const handleChange = (
    field: keyof Omit<CreateProcurementPayload, "pr_number">,
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
      items[index] = { ...items[index], [field]: value } as (typeof items)[0];
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          part_number: "",
          description: "",
          quantity: 1,
          unit_of_measure: "",
          quantity_approved: 0,
          asset_category_id: "",
        },
      ],
    }));
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
      await onUpdate(procurement.procurement_id, form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Edit purchase request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* End User — Combobox (Sama seperti Create) */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">End user</Label>
            <Popover
              open={endUserPopoverOpen}
              onOpenChange={setEndUserPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between font-normal",
                    !form.end_user && "text-muted-foreground",
                  )}
                >
                  <span className="truncate">
                    {form.end_user || "Pilih karyawan..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Cari nama karyawan..."
                    value={keyword}
                    onValueChange={setKeyword}
                  />{" "}
                  <CommandList>
                    {isSearching ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        Mencari...
                      </div>
                    ) : (
                      <>
                        <CommandEmpty></CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => {
                            const label = user.profile?.name
                              ? `${user.profile.name}`
                              : user.email;
                            const isSelected = form.end_user === label;
                            return (
                              <CommandItem
                                key={user.user_id}
                                value={`${user.profile?.name ?? ""} ${user.email}`}
                                onSelect={() => {
                                  handleChange("end_user", label);
                                  setEndUserPopoverOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {user.profile?.name ?? "—"}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {user.email}
                                  </p>
                                </div>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

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
                Jatuh tempo
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
              value={form.remarks || ""}
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
                    <Select
                      value={item.unit_of_measure}
                      onValueChange={(value) =>
                        handleItemChange(index, "unit_of_measure", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih satuan" />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        side="bottom"
                        align="start"
                        className="max-h-32 overflow-y-auto"
                      >
                        {unitOptions.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
            onClick={onClose}
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

export default UpdateProcurementModal;
