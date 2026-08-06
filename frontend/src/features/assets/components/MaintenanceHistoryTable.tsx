// HAPUS import Badge bawaan, ganti dengan StatusBadge global
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import type { Maintenance } from "@/types/maintenance";

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// HAPUS fungsi maintenanceStatusVariant karena sudah ditangani oleh StatusBadge

export default function MaintenanceHistoryTable({
  maintenances,
}: {
  maintenances: Maintenance[];
}) {
  const navigate = useNavigate();
  
  return (
    <div className="rounded-lg border bg-card">
      <div className="px-5 py-4 border-b">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Riwayat Pemeliharaan
        </p>
      </div>
      {maintenances && maintenances.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Pelapor</TableHead>
              <TableHead>Tanggal Lapor</TableHead>
              <TableHead>Masalah</TableHead>
              <TableHead>Selesai</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenances.map((m) => (
              <TableRow 
                key={m.maintenance_id} 
                onClick={() => navigate(`/pemeliharaan/${m.maintenance_id}`)} 
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium">
                  {m.reporter?.profile?.name ?? "—"}
                </TableCell>
                <TableCell>{formatDate(m.createdAt)}</TableCell>
                <TableCell>{m.description}</TableCell>
                <TableCell>{formatDate(m.completed_at)}</TableCell>
                <TableCell>
                  {/* GANTI PAKAI STATUS BADGE */}
                  <StatusBadge status={m.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Belum ada riwayat pemeliharaan
        </div>
      )}
    </div>
  );
}