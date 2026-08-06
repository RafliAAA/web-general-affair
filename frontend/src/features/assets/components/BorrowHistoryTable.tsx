import { StatusBadge } from "../../../components/shared/StatusBadge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import type { Borrow } from "@/types/inventory";

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


export default function BorrowHistoryTable({ borrows }: { borrows: Borrow[] }) {
  const validBorrows =
    borrows?.filter(
      (b) => b.status === "Disetujui" || b.status === "Dikembalikan",
    ) || [];

  return (
    <div className="rounded-lg border bg-card">
      <div className="px-5 py-4 border-b">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Riwayat peminjaman
        </p>
      </div>

      {validBorrows.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama karyawan</TableHead>
              <TableHead>Tanggal pinjam</TableHead>
              <TableHead>Tanggal rencana kembali</TableHead>
              <TableHead>Tanggal kembali</TableHead>
              <TableHead>Kondisi kembali</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validBorrows.map((b) => {
              const returnData = b.returns?.[0];
              return (
                <TableRow key={b.borrow_id}>
                  <TableCell className="font-medium">
                    {b.user?.profile?.name ?? "—"}
                  </TableCell>
                  <TableCell>{formatDate(b.createdAt)}</TableCell>
                  <TableCell>{formatDate(b.expected_return_date)}</TableCell>
                  <TableCell>
                    {returnData ? formatDate(returnData.return_date) : "—"}
                  </TableCell>
                  <TableCell>
                    {returnData?.return_condition ? (
                      <StatusBadge status={returnData.return_condition} />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={b.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Belum ada riwayat peminjaman
        </div>
      )}
    </div>
  );
}
