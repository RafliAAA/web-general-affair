import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import type { BorrowRequest } from "../services/borrowService";

interface Props {
  borrows: BorrowRequest[];
  onApprove: (borrow_id: string) => void;
  onReject: (borrow_id: string) => void;
}

const statusVariant = (status: string) => {
  switch (status) {
    case "Disetujui":    return "success";
    case "Menunggu":     return "outline";
    case "Ditolak":
    case "Dibatalkan":   return "destructive";
    case "Dikembalikan": return "secondary";
    default:             return "outline";
  }
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const BorrowTable = ({ borrows, onApprove, onReject }: Props) => {
  if (borrows.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Tidak ada pengajuan peminjaman
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama karyawan</TableHead>
          <TableHead>Nama aset</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Alasan</TableHead>
          <TableHead>Tgl rencana kembali</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {borrows.map((b) => (
          <TableRow key={b.borrow_id}>
            <TableCell className="font-medium">
              {b.user?.profile?.name ?? "—"}
            </TableCell>
            <TableCell>{b.asset.asset_name}</TableCell>
            <TableCell>{b.asset.asset_type}</TableCell>
            <TableCell className="max-w-48 truncate">{b.borrow_reason}</TableCell>
            <TableCell>{formatDate(b.expected_return_date)}</TableCell>
            <TableCell>
              <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
            </TableCell>
            <TableCell>
              {b.status === "Menunggu" ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => onApprove(b.borrow_id)}
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Setujui
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => onReject(b.borrow_id)}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Tolak
                  </Button>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BorrowTable;