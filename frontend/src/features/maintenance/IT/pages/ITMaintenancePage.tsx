import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayCircle, CheckCircle, XCircle } from "lucide-react";
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
import { useITMaintenance } from "../hooks/useITMaintenance";
import MaintenanceStatusBadge from "../../user/components/MaintenanceStatusBadge";
import CompleteMaintenanceModal from "../components/CompleteMaintenanceModal";
import CannotRepairModal from "../components/CannotRepairModal";
import type { CannotRepairPayload, Maintenance } from "@/types/maintenance";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

interface SectionProps {
  title: string;
  count?: number;
  countColor?: string;
  data: Maintenance[];
  emptyText: string;
  children: React.ReactNode;
}

const Section = ({
  title,
  count,
  countColor,
  data,
  emptyText,
  children,
}: SectionProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <p className="text-sm font-medium">{title}</p>
      {count !== undefined && count > 0 && (
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${countColor}`}
        >
          {count}
        </span>
      )}
    </div>
    <div className="rounded-lg border bg-card">
      {data.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          {emptyText}
        </div>
      ) : (
        children
      )}
    </div>
  </div>
);

const ITMaintenancePage = () => {
  const navigate = useNavigate();
  const {
    queue,
    inProgress,
    history,
    loading,
    error,
    handleTake,
    handleComplete,
    handleCannotRepair,
  } = useITMaintenance();

  const [completeTarget, setCompleteTarget] = useState<Maintenance | null>(
    null,
  );
  const [cannotRepairTarget, setCannotRepairTarget] =
    useState<Maintenance | null>(null);

  if (loading) {
    return (
      <DashboardLayout title="Maintenance IT">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Maintenance IT">
        <div className="py-12 text-center text-sm text-muted-foreground">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Maintenance IT">
      <div className="space-y-8">
        <Section
          title="Antrian Pekerjaan"
          count={queue.length}
          countColor="bg-orange-100 text-orange-600"
          data={queue}
          emptyText="Tidak ada antrian pekerjaan"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama aset</TableHead>
                <TableHead>Pelapor</TableHead>
                <TableHead>Tanggal lapor</TableHead>
                <TableHead>Diverifikasi oleh</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.map((m) => (
                <TableRow key={m.maintenance_id}>
                  <TableCell className="font-medium">
                    {m.asset.asset_name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {m.reporter.profile?.name ?? "—"}
                  </TableCell>
                  <TableCell>{formatDate(m.createdAt)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {m.verifier?.profile?.name ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                      onClick={() => handleTake(m.maintenance_id)}
                    >
                      <PlayCircle className="h-3.5 w-3.5 mr-1" />
                      Ambil
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        <Section
          title="Sedang Dikerjakan"
          count={inProgress.length}
          countColor="bg-blue-100 text-blue-600"
          data={inProgress}
          emptyText="Tidak ada maintenance yang sedang dikerjakan"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama aset</TableHead>
                <TableHead>Pelapor</TableHead>
                <TableHead>Tanggal lapor</TableHead>
                <TableHead>Diverifikasi oleh</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {inProgress.map((m) => (
                <TableRow key={m.maintenance_id}>
                  <TableCell className="font-medium">
                    {m.asset.asset_name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {m.reporter.profile?.name ?? "—"}
                  </TableCell>
                  <TableCell>{formatDate(m.createdAt)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {m.verifier?.profile?.name ?? "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                        onClick={() => setCompleteTarget(m)}
                      >
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Selesai
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300"
                        onClick={() => setCannotRepairTarget(m)}
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Tidak Dapat Diperbaiki
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        <Section
          title="Riwayat"
          data={history}
          emptyText="Belum ada riwayat maintenance"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama aset</TableHead>
                <TableHead>Pelapor</TableHead>
                <TableHead>Tanggal lapor</TableHead>
                <TableHead>Diverifikasi oleh</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((m) => (
                <TableRow
                  key={m.maintenance_id}
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/perbaikan/${m.maintenance_id}`)
                  }
                >
                  <TableCell className="font-medium">
                    {m.asset.asset_name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {m.reporter.profile?.name ?? "—"}
                  </TableCell>
                  <TableCell>{formatDate(m.createdAt)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {m.verifier?.profile?.name ?? "—"}
                  </TableCell>
                  <TableCell>
                    <MaintenanceStatusBadge status={m.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
      </div>

      <CompleteMaintenanceModal
        open={!!completeTarget}
        onClose={() => setCompleteTarget(null)}
        onSubmit={async (notes) => {
          if (!completeTarget) return;
          await handleComplete(completeTarget.maintenance_id, notes);
          setCompleteTarget(null);
        }}
      />

      <CannotRepairModal
        open={!!cannotRepairTarget}
        onClose={() => setCannotRepairTarget(null)}
        onSubmit={async (payload: CannotRepairPayload) => {
          if (!cannotRepairTarget) return;
          await handleCannotRepair(cannotRepairTarget.maintenance_id, payload);
          setCannotRepairTarget(null);
        }}
      />
    </DashboardLayout>
  );
};

export default ITMaintenancePage;
