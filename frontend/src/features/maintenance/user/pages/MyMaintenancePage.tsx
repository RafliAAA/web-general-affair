import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMyMaintenance } from "../hooks/useMyMaintenance";
import CreateMaintenanceModal from "../components/CreateMaintenanceModal";
import MaintenanceStatusBadge from "../components/MaintenanceStatusBadge";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const MyMaintenancePage = () => {
  const navigate = useNavigate();
  const { maintenances, loading, error, handleCreate } = useMyMaintenance();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <DashboardLayout title="Laporan Maintenance Saya">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {maintenances.length} laporan
          </p>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Lapor kerusakan
          </Button>
        </div>

        <div className="rounded-lg border bg-card">
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {error}
            </div>
          ) : maintenances.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Belum ada laporan maintenance
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama aset</TableHead>
                  <TableHead>Tanggal lapor</TableHead>
                  <TableHead>Diverifikasi oleh</TableHead>
                  <TableHead>Diperbaiki oleh</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenances.map((m) => (
                  <TableRow
                    key={m.maintenance_id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/lapor-kerusakan/${m.maintenance_id}`)}
                  >
                    <TableCell className="font-medium">
                      {m.asset.asset_name}
                    </TableCell>
                    <TableCell>{formatDate(m.createdAt)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {m.verifier?.profile?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {m.handler?.profile?.name ?? "—"}
                    </TableCell>
                    <TableCell>
                      <MaintenanceStatusBadge status={m.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <CreateMaintenanceModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </DashboardLayout>
  );
};

export default MyMaintenancePage;