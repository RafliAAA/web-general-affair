import { Check, X, RotateCcw } from "lucide-react";
import { StatusBadge } from "../../../../components/shared/StatusBadge";
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
import { useNavigate } from "react-router-dom";

interface Props {
  borrows: BorrowRequest[];
  onApprove?: (borrow_id: string) => void;
  onReject?: (borrow_id: string) => void;
  onReturn?: (borrow: BorrowRequest) => void;
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const BorrowTable = ({ borrows, onApprove, onReject, onReturn }: Props) => {
  const navigate = useNavigate();
  if (borrows.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Tidak ada data peminjaman
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama karyawan</TableHead>
          <TableHead>Nama aset</TableHead>
          <TableHead>Alasan</TableHead>
          <TableHead>Tgl rencana kembali</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {borrows.map((b) => (
          <TableRow
            key={b.borrow_id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => navigate(`/peminjaman/${b.borrow_id}`)}
          >
            <TableCell className="font-medium">
              {b.user?.profile?.name ?? "—"}
            </TableCell>
            <TableCell>{b.asset.asset_name}</TableCell>
            <TableCell className="max-w-48 truncate">
              {b.borrow_reason}
            </TableCell>
            <TableCell>{formatDate(b.expected_return_date)}</TableCell>
            <TableCell>
              <StatusBadge status={b.status} />
            </TableCell>
            <TableCell
              className="text-right"
              onClick={(e) => e.stopPropagation()}
            >
              {b.status === "Menunggu" && (
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => onApprove?.(b.borrow_id)}
                  >
                    <Check className="h-3.5 w-3.5 mr-1" /> Setujui
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => onReject?.(b.borrow_id)}
                  >
                    <X className="h-3.5 w-3.5 mr-1" /> Tolak
                  </Button>
                </div>
              )}
              {b.status === "Disetujui" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => onReturn?.(b)}
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" /> Kembalikan
                </Button>
              )}
              {(b.status === "Dikembalikan" ||
                b.status === "Ditolak" ||
                b.status === "Dibatalkan") && (
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
