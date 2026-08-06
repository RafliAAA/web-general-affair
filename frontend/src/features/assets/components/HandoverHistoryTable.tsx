import { useNavigate } from "react-router-dom";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import type { HandoverItem } from "@/types/handover";

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function HandoverHistoryTable({
  handoverItems,
}: {
  handoverItems: HandoverItem[];
}) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border bg-card">
      <div className="px-5 py-4 border-b">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Riwayat Penyerahan
        </p>
      </div>
      {handoverItems && handoverItems.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Karyawan</TableHead>
              <TableHead>Tanggal Serah Terima</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead>Tanggal Pengembalian</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {handoverItems.map((h) => (
              <TableRow
                key={h.handover_item_id}
                onClick={() => navigate(`/serah-terima/${h.handover_id}`)}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium">
                  {h.handover?.receiver?.profile?.name ?? "—"}
                </TableCell>
                <TableCell>{formatDate(h.handover?.handover_date)}</TableCell>
                <TableCell>{h.notes ?? "—"}</TableCell>
                <TableCell>{formatDate(h.handover?.returned_at)}</TableCell>
                <TableCell>
                  <StatusBadge status={h.handover?.status ?? "—"} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Belum ada riwayat penyerahan
        </div>
      )}
    </div>
  );
}
