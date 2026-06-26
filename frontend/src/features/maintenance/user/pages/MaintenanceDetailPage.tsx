import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Wrench, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMaintenanceDetail } from "../hooks/useMaintenanceDetail";
import MaintenanceStatusBadge from "../components/MaintenanceStatusBadge";

const formatDate = (dateStr: string | null) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center justify-between py-2 border-b last:border-0">
    <span className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-lg border bg-card p-5 space-y-3">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
      {title}
    </p>
    {children}
  </div>
);

const MaintenanceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { maintenance, loading, error } = useMaintenanceDetail(id);

  return (
    <DashboardLayout title="Detail Laporan Maintenance">
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </div>
      ) : error || !maintenance ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <p className="text-sm text-muted-foreground">
            {error ?? "Data tidak ditemukan"}
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            Kembali
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-medium">
                {maintenance.asset.asset_name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {maintenance.asset.asset_code} · {maintenance.asset.asset_type}
              </p>
            </div>
            <MaintenanceStatusBadge status={maintenance.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SectionCard title="Informasi laporan">
              <InfoRow
                icon={Calendar}
                label="Tanggal lapor"
                value={formatDate(maintenance.createdAt)}
              />
              <InfoRow
                icon={User}
                label="Dilaporkan oleh"
                value={maintenance.reporter.profile?.name ?? "—"}
              />
              <InfoRow
                icon={User}
                label="Diverifikasi oleh"
                value={maintenance.verifier?.profile?.name ?? "—"}
              />
              <InfoRow
                icon={Calendar}
                label="Tanggal verifikasi"
                value={formatDate(maintenance.verified_at)}
              />
            </SectionCard>

            <SectionCard title="Proses pengerjaan">
              <InfoRow
                icon={Wrench}
                label="Dikerjakan oleh"
                value={maintenance.reporter.profile?.name ?? "—"}
              />
              <InfoRow
                icon={Calendar}
                label="Tanggal mulai"
                value={formatDate(maintenance.taken_at)}
              />
              <InfoRow
                icon={Calendar}
                label="Tanggal selesai"
                value={formatDate(maintenance.completed_at)}
              />
            </SectionCard>
          </div>

          <SectionCard title="Deskripsi kerusakan">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {maintenance.description}
            </p>
          </SectionCard>

          {maintenance.rejection_reason && (
            <SectionCard title="Alasan penolakan">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {maintenance.rejection_reason}
              </p>
            </SectionCard>
          )}

          {maintenance.resolution_notes && (
            <SectionCard title="Catatan penyelesaian">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {maintenance.resolution_notes}
              </p>
            </SectionCard>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MaintenanceDetailPage;