import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import api from "@/lib/axios";
import type { ProcurementItem, UpdateProcurementPayload } from "../../../types/procurement";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  procurementId: string;
  initialItems: ProcurementItem[];
  initialData: any;
  onSuccess: () => void;
}

const ApproveProcurementModal = ({ open, onClose, procurementId, initialItems, initialData, onSuccess }: Props) => {
  const [items, setItems] = useState<ProcurementItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // 1. Fetch kategori aset untuk dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/assets/categories"); // Sesuaikan endpointmu
        setCategories(res.data.data || res.data);
      } catch (error) {
        console.error("Gagal fetch kategori", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (open) {
      setItems(initialItems.map(item => ({
        ...item,
        quantity_approved: item.quantity_approved > 0 ? item.quantity_approved : item.quantity
      })));
    }
  }, [open, initialItems]);

  const handleQtyApprovedChange = (id: string, value: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.procurement_item_id === id
          ? { ...item, quantity_approved: Math.min(Math.max(value, 0), item.quantity) }
          : item
      )
    );
  };

  // 2. Handle Tombol Tolak / Setujui
  const handleToggleReject = (id: string, isCurrentlyRejected: boolean, originalQty: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.procurement_item_id === id
          ? { ...item, quantity_approved: isCurrentlyRejected ? originalQty : 0 }
          : item
      )
    );
  };

  const handleCategoryChange = (id: string, categoryId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.procurement_item_id === id ? { ...item, asset_category_id: categoryId } : item
      )
    );
  };

  const handleSubmit = async () => {
    const invalidItem = items.find(item => item.quantity_approved > 0 && !item.asset_category_id);
    if (invalidItem) {
      toast.error(`Kategori wajib dipilih untuk ${invalidItem.description}`);
      return;
    }

    setLoading(true);
    let isSuccess = false;
    try {
      const payload: UpdateProcurementPayload = {
        ...initialData,
        status: "Disetujui",
        items: items.map((item) => ({
          ...item,
          asset_category_id: item.asset_category_id || "",
        })),
      };

      await api.patch(`/procurement/${procurementId}`, payload);
      toast.success("Pengadaan berhasil diproses dan aset telah dibuat!");
      isSuccess = true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memproses pengadaan");
    } finally {
      setLoading(false);
      if (isSuccess) {
        onSuccess();
        onClose();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Proses Pengadaan (Approve)</DialogTitle>
        </DialogHeader>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Barang</TableHead>
                <TableHead className="w-[80px]">Qty Req</TableHead>
                <TableHead className="w-[100px]">Qty App</TableHead>
                <TableHead className="w-[180px]">Kategori Aset</TableHead>
                <TableHead className="w-[100px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const isRejected = item.quantity_approved === 0;
                return (
                  <TableRow
                    key={item.procurement_item_id}
                    className={isRejected ? "bg-red-50/50" : ""}
                  >
                    <TableCell className="font-medium">
                      {item.description}
                      {isRejected && (
                        <span className="block text-xs text-red-500">
                          Ditolak
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max={item.quantity}
                        value={item.quantity_approved}
                        onChange={(e) =>
                          handleQtyApprovedChange(
                            item.procurement_item_id,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="h-8 w-20"
                        disabled={isRejected}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.asset_category_id || ""}
                        onValueChange={(val) =>
                          handleCategoryChange(item.procurement_item_id, val)
                        }
                        disabled={isRejected}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem
                              key={cat.asset_category_id}
                              value={cat.asset_category_id}
                            >
                              {cat.category_name} ({cat.category_code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      {isRejected ? (
                        // Tombol Setujui (Hijau Soft)
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
                          onClick={() =>
                            handleToggleReject(
                              item.procurement_item_id,
                              true,
                              item.quantity,
                            )
                          }
                        >
                          Setujui
                        </Button>
                      ) : (
                        // Tombol Tolak (Merah Soft)
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
                          onClick={() =>
                            handleToggleReject(
                              item.procurement_item_id,
                              false,
                              item.quantity,
                            )
                          }
                        >
                          Tolak
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <p className="text-xs text-muted-foreground">
          Klik "Tolak" untuk menolak pengadaan item (Qty akan menjadi 0). Klik "Setujui" untuk membatalkan penolakan.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : "Proses & Buat Aset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveProcurementModal;