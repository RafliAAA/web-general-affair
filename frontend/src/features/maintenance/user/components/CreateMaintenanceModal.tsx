import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Search, Check } from "lucide-react";
import api from "../../../../lib/axios";
import type { BorrowResponse, CreateMaintenancePayload, MaintenanceResponse } from "@/types/maintenance";
import type { BorrowedAsset } from "@/types/inventory";



interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateMaintenancePayload) => Promise<unknown>;
}



const CreateMaintenanceModal = ({ open, onClose, onSubmit }: Props) => {
  const [assets, setAssets] = useState<BorrowedAsset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [search, setSearch] = useState("");
  const [assetId, setAssetId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

 useEffect(() => {
  if (!open) return;
  setLoadingAssets(true);
  setAssets([]);
  setAssetId("");
  setSearch("");
  setDescription("");

  const fetchAssets = async () => {
    try {
      const [borrowRes, maintenanceRes] = await Promise.all([
        api.get("/borrow/me"),
        api.get("/maintenance/me"),
      ]);

      const approved = (borrowRes.data.data ?? []).filter(
        (b: BorrowResponse) => b.status === "Disetujui",
      );

      const activeAssetIds = new Set(
        (maintenanceRes.data.data ?? [])
          .filter((m: MaintenanceResponse) =>
            ["MenungguVerifikasi", "MenungguDikerjakan", "SedangDikerjakan"].includes(m.status),
          )
          .map((m: MaintenanceResponse) => m.asset_id),
      );

      setAssets(
        approved
          .filter((b: BorrowResponse) => !activeAssetIds.has(b.asset_id))
          .map((b: BorrowResponse) => ({
            asset_id: b.asset_id,
            asset_name: b.asset.asset_name,
            asset_type: b.asset.asset_type,
          })),
      );
    } catch (err) {
      console.error("Failed to fetch assets", err);
    } finally {
      setLoadingAssets(false);
    }
  };

  fetchAssets();
}, [open]);

  const filtered = assets.filter((a) =>
    a.asset_name.toLowerCase().includes(search.toLowerCase()),
  );

  const isValid = assetId !== "" && description.trim() !== "";

  const handleClose = () => {
    setAssetId("");
    setSearch("");
    setDescription("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    try {
      setLoading(true);
      await onSubmit({ asset_id: assetId, description });
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Lapor kerusakan aset
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Pilih aset */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Pilih aset</Label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari aset..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="rounded-md border max-h-48 overflow-y-auto">
              {loadingAssets ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Memuat aset...
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  {assets.length === 0
                    ? "Tidak ada aset yang sedang dipinjam"
                    : "Aset tidak ditemukan"}
                </div>
              ) : (
                filtered.map((a) => {
                  const selected = assetId === a.asset_id;
                  return (
                    <div
                      key={a.asset_id}
                      onClick={() => setAssetId(a.asset_id)}
                      className={`flex items-center justify-between px-3 py-2.5 cursor-pointer border-b last:border-0 transition-colors ${
                        selected
                          ? "bg-primary/5 text-primary"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium">{a.asset_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.asset_type}
                        </p>
                      </div>
                      {selected && (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Deskripsi kerusakan
            </Label>
            <Textarea
              placeholder="Jelaskan kerusakan yang terjadi..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            disabled={!isValid || loading || loadingAssets}
            onClick={handleSubmit}
          >
            {loading ? "Melaporkan..." : "Lapor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMaintenanceModal;