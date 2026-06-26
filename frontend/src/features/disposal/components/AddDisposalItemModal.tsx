import { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import api from "../../../lib/axios";

interface AvailableAsset {
  asset_id: string;
  asset_code: string;
  asset_name: string;
  asset_type: string;
  serial_number: string;
  condition: string;
  status: string;
}

interface PendingItem {
  asset_id: string;
  asset_name: string;
  asset_code: string;
  method: string;
  notes: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    items: { asset_id: string; method: string; notes?: string }[],
  ) => Promise<void>;
  excludedIds: string[];
}

const METHOD_OPTIONS = ["Hibah", "Jual", "Musnahkan", "Tukar Tambah"];

const conditionVariant = (condition: string) => {
  switch (condition) {
    case "Baik":
      return "success";
    case "Cukup":
      return "outline";
    default:
      return "destructive";
  }
};

const AddDisposalItemModal = ({
  open,
  onClose,
  onSubmit,
  excludedIds,
}: Props) => {
  const [assets, setAssets] = useState<AvailableAsset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Step: "select" | "configure"
  const [step, setStep] = useState<"select" | "configure">("select");

  useEffect(() => {
    if (!open) return;
    setLoadingAssets(true);
    api
      .get("/assets")
      .then((res) => setAssets(res.data.data))
      .catch((err) => console.error("Failed to fetch assets", err))
      .finally(() => setLoadingAssets(false));
  }, [open]);

  const alreadyAddedIds = new Set([
    ...excludedIds,
    ...items.map((i) => i.asset_id),
  ]);

  const filtered = assets
    .filter((a) => !alreadyAddedIds.has(a.asset_id))
    .filter(
      (a) =>
        a.asset_name.toLowerCase().includes(search.toLowerCase()) ||
        a.asset_code.toLowerCase().includes(search.toLowerCase()),
    );

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddSelected = () => {
    const selected = assets.filter((a) => checked.has(a.asset_id));
    setItems((prev) => [
      ...prev,
      ...selected.map((a) => ({
        asset_id: a.asset_id,
        asset_name: a.asset_name,
        asset_code: a.asset_code,
        method: "",
        notes: "",
      })),
    ]);
    setChecked(new Set());
    setStep("configure");
  };

  const handleItemChange = (
    index: number,
    field: "method" | "notes",
    value: string,
  ) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const isValid = items.length > 0 && items.every((i) => i.method);

  const reset = () => {
    setItems([]);
    setChecked(new Set());
    setSearch("");
    setStep("select");
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    try {
      setLoading(true);
      await onSubmit(
        items.map((i) => ({
          asset_id: i.asset_id,
          method: i.method,
          notes: i.notes || undefined,
        })),
      );
      reset();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            {step === "select" ? "Pilih aset" : "Atur metode disposal"}
          </DialogTitle>
        </DialogHeader>

        {/* ── STEP 1: Pilih aset ── */}
        {step === "select" && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari aset..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="rounded-lg border max-h-96 overflow-y-auto">
              {loadingAssets ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Memuat data aset...
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Tidak ada aset tersedia
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10" />
                      <TableHead>Nama aset</TableHead>
                      <TableHead>Kode aset</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Kondisi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((asset) => (
                      <TableRow
                        key={asset.asset_id}
                        className="cursor-pointer"
                        onClick={() => toggleCheck(asset.asset_id)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={checked.has(asset.asset_id)}
                            onCheckedChange={() => toggleCheck(asset.asset_id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {asset.asset_name}
                        </TableCell>
                        <TableCell>{asset.asset_code}</TableCell>
                        <TableCell>{asset.asset_type}</TableCell>
                        <TableCell>
                          <Badge
                            variant={conditionVariant(asset.condition)}
                            className="text-xs"
                          >
                            {asset.condition}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Aset yang sudah dikonfigurasi sebelumnya */}
            {items.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {items.length} aset sudah ditambahkan.{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => setStep("configure")}
                >
                  Lihat & atur metode
                </button>
              </p>
            )}
          </div>
        )}

        {/* ── STEP 2: Konfigurasi metode ── */}
        {step === "configure" && (
          <div className="space-y-3 py-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setStep("select")}
            >
              + Pilih aset lain
            </Button>

            {items.length === 0 ? (
              <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
                Belum ada aset dipilih
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={item.asset_id}
                    className="rounded-lg border p-3 space-y-3 bg-muted/20"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.asset_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.asset_code}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 h-6 px-2"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                          Metode
                        </Label>
                        <Select
                          value={item.method}
                          onValueChange={(val) =>
                            handleItemChange(index, "method", val)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih metode" />
                          </SelectTrigger>
                          <SelectContent>
                            {METHOD_OPTIONS.map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                          Catatan{" "}
                          <span className="text-muted-foreground/60">
                            (opsional)
                          </span>
                        </Label>
                        <Input
                          placeholder="contoh: Hibah ke Kantor Pusat"
                          value={item.notes}
                          onChange={(e) =>
                            handleItemChange(index, "notes", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={
              step === "configure" ? () => setStep("select") : handleClose
            }
            disabled={loading}
          >
            {step === "configure" ? "Kembali" : "Batal"}
          </Button>

          {step === "select" ? (
            <Button
              size="sm"
              disabled={checked.size === 0}
              onClick={handleAddSelected}
            >
              Lanjut ({checked.size})
            </Button>
          ) : (
            <Button
              size="sm"
              disabled={!isValid || loading}
              onClick={handleSubmit}
            >
              {loading ? "Menyimpan..." : `Simpan (${items.length})`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDisposalItemModal;
