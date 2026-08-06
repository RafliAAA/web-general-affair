import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios"; 
import { useUserSearch } from "../../user/hooks/useUserSearch";
import type { CreateProcurementPayload } from "../../../types/procurement";

// a

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
  pr_date: "",
  due_date: "",
  end_user: "",
  remarks: "",
  actualization_id: "",
  items: [{ ...emptyItem }],
};

const unitOptions = ["PCS", "UNIT", "SET", "BOX", "PACK"];

const CreateProcurementModal = ({ onCreate }: Props) => {
  const [searchParams] = useSearchParams();
  const actualization_id_from_url = searchParams.get("actualization_id") || "";
  const end_user_from_url = searchParams.get("end_user") || "";

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateProcurementPayload>(initialForm);
  const [loading, setLoading] = useState(false);

  // State untuk End User Combobox
  const [endUserPopoverOpen, setEndUserPopoverOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { users, isSearching, searchUsers } = useUserSearch();

  // State untuk Actualization Combobox
  const [actualizations, setActualizations] = useState<any[]>([]);
  const [actualPopoverOpen, setActualPopoverOpen] = useState(false);
  const [actualKeyword, setActualKeyword] = useState("");

  // Saat modal dibuka, cek parameter URL
  useEffect(() => {
    if (open) {
      setForm((prev) => ({
        ...prev,
        actualization_id: actualization_id_from_url,
        end_user: end_user_from_url || prev.end_user,
      }));
    }
  }, [open, actualization_id_from_url, end_user_from_url]);

  // Fetch Actualization Forms saat modal dibuka
  useEffect(() => {
    if (open) {
      api
        .get("/maintenance/actualizations")
        .then((res) => setActualizations(res.data.data || []))
        .catch((err) => console.error("Gagal fetch actualizations:", err));
    }
  }, [open]);

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
      items[index] = { ...items[index], [field]: value } as (typeof items)[0];
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

  // Cari data actualization yang dipilih untuk ditampilkan di tombol
  const selectedActualization = actualizations.find(
    (a) => a.actualization_id === form.actualization_id,
  );

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
          {actualization_id_from_url && (
            <div className="mt-2 inline-flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-md text-xs font-medium w-fit">
              Pengganti Aset Rusak (Form Aktualisasi Terlampir)
            </div>
          )}
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* COMBOBOX FORM AKTUALISASI (Opsional) */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Tautkan Form Aktualisasi{" "}
              <span className="text-muted-foreground/60">
                (Opsional - jika pengganti aset rusak)
              </span>
            </Label>
            <Popover
              open={actualPopoverOpen}
              onOpenChange={setActualPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between font-normal",
                    !form.actualization_id && "text-muted-foreground",
                  )}
                >
                  {selectedActualization
                    ? `${selectedActualization.form_number} - ${selectedActualization.user_name ?? "N/A"}`
                    : "Pilih form aktualisasi (SVC)..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Cari nomor form (SVC)..."
                    value={actualKeyword}
                    onValueChange={setActualKeyword}
                  />
                  <CommandList>
                    <CommandEmpty>
                      Form aktualisasi tidak ditemukan.
                    </CommandEmpty>
                    <CommandGroup>
                      {actualizations.map((act) => (
                        <CommandItem
                          key={act.actualization_id}
                          value={`${act.form_number} ${act.user_name ?? ""}`}
                          onSelect={() => {
                            handleChange(
                              "actualization_id",
                              act.actualization_id,
                            );
                            setActualPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              form.actualization_id === act.actualization_id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {act.form_number}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              User: {act.user_name ?? "—"}
                            </p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* End User — Combobox */}
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
                  />
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
                <Plus className="h-3.5 w-3.5 mr-1" /> Tambah item
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
        </div>a

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
