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
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { conditionVariant } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import api from "@/lib/axios";
import type { Asset } from "../../../../types/inventory";

interface Props {
  asset: Asset;
  onConfirm: (
    borrow_reason: string,
    borrow_date: string,
    expected_return_date: string,
    recipient_type: "Personal" | "Divisi",
  ) => void;
  onClose: () => void;
  loading: boolean;
}

const today = new Date().toISOString().split("T")[0];

const BorrowModal = ({ asset, onConfirm, onClose, loading }: Props) => {
  const [borrow_reason, setBorrowReason] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [borrowDate, setBorrowDate] = useState("");
  const [recipientType, setRecipientType] = useState<"Personal" | "Divisi">(
    "Personal",
  );

  // State untuk Riwayat Aset
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Fetch riwayat peminjaman aset ini (tanpa nama user)
  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const res = await api.get(`/assets/${asset.asset_id}`); // Asumsi endpoint getAssetById mengembalikan data borrow
        setHistory(res.data.data?.borrow || []);
      } catch (err) {
        console.error("Gagal memuat riwayat", err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [asset.asset_id]);

  const isAvailable = asset.status === "Tersedia";

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Detail Aset
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Info Aset & Spesifikasi */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">{asset.asset_name}</p>
              <StatusBadge status={asset.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              {asset.asset_code} · {asset.asset_category?.category_name || "—"}
            </p>
            {/* 🌟 SPEK ASTEN */}
            <div className="pt-2 mt-2 border-t">
              <p className="text-xs font-medium text-foreground">
                Spesifikasi:
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {asset.specification || "Tidak ada spesifikasi"}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-muted-foreground">Kondisi:</span>
              <Badge
                variant={conditionVariant(asset.condition)}
                className="text-xs"
              >
                {asset.condition}
              </Badge>
            </div>
          </div>

          {/* 🌟 RIWAYAT PEMINJAMAN ASENYA (TANPA NAMA KARYAWAN) */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Riwayat Peminjaman Aset</p>
            <div className="rounded-md border max-h-40 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Tanggal Pinjam</TableHead>
                    <TableHead>Tanggal Kembali</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingHistory ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground py-4 text-xs"
                      >
                        Memuat riwayat...
                      </TableCell>
                    </TableRow>
                  ) : history.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground py-4 text-xs"
                      >
                        Belum ada riwayat
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.slice(0, 5).map((b, index) => (
                      <TableRow key={b.borrow_id}>
                        <TableCell className="text-xs">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(b.borrow_date).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-xs">
                          {b.expected_return_date
                            ? new Date(
                                b.expected_return_date,
                              ).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </TableCell>
                      
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* FORM PEMINJAMAN (Hanya muncul jika aset Tersedia) */}
          {isAvailable ? (
            <div className="space-y-4 border-t pt-4">
              <p className="text-sm font-medium">Form Peminjaman</p>

              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">
                  Jenis Peminjam
                </Label>
                <Select
                  value={recipientType}
                  onValueChange={(val) => setRecipientType(val as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis peminjaman" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Personal">
                      Personal (Individu)
                    </SelectItem>
                    <SelectItem value="Divisi">Divisi / Departemen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">
                  Tanggal peminjaman
                </Label>
                <Input
                  type="date"
                  min={today}
                  value={borrowDate}
                  onChange={(e) => setBorrowDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">
                  Keperluan
                </Label>
                <Input
                  value={borrow_reason}
                  onChange={(e) => setBorrowReason(e.target.value)}
                  placeholder="Masukkan keperluan peminjaman..."
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">
                  Rencana tanggal pengembalian
                </Label>
                <Input
                  type="date"
                  min={today}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 text-yellow-700 border border-yellow-200 p-3 rounded-md text-xs text-center">
              Aset ini sedang dipinjam dan tidak tersedia untuk
              diajukan.
            </div>
          )}
        </div>

        {isAvailable && (
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
              disabled={!returnDate || !borrowDate || loading}
              onClick={() =>
                onConfirm(
                  borrow_reason,
                  borrowDate,
                  new Date(returnDate).toISOString(),
                  recipientType,
                )
              }
            >
              {loading ? "Mengajukan..." : "Ajukan"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BorrowModal;
