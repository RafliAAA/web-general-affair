import { CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import type { BorrowRequest } from "../services/returnService";

interface Props {
  borrows: BorrowRequest[];
  onReturn: (borrow: BorrowRequest) => void;
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ReturnTable = ({ borrows, onReturn }: Props) => {
  if (borrows.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Tidak ada aset yang sedang dipinjam
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
          <TableHead>Serial number</TableHead>
          <TableHead>Tgl pinjam</TableHead>
          <TableHead>Tgl rencana kembali</TableHead>
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
            <TableCell>{b.asset.serial_number}</TableCell>
            <TableCell>{formatDate(b.createdAt)}</TableCell>
            <TableCell>{formatDate(b.expected_return_date)}</TableCell>
            <TableCell>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReturn(b)}
              >
                <CornerDownLeft className="h-3.5 w-3.5 mr-1.5" />
                Kembalikan
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReturnTable;