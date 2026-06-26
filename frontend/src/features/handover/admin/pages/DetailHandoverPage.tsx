import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Building,
  Calendar,
  RefreshCw,
  CornerDownLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { useHandoverDetail } from "../hooks/useHandoverDetail";
import ReturnHandoverModal from "../components/ReturnHandoverDialog";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
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

const DetailSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-4 w-20" />
    <div className="space-y-2">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-5 space-y-3">
          <Skeleton className="h-3 w-24" />
          {Array.from({ length: 4 }).map((_, j) => (
            <div
              key={j}
              className="flex justify-between py-2 border-b last:border-0"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const DetailHandoverPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handover, loading, error, handleReturn } = useHandoverDetail(id);
  const [returnOpen, setReturnOpen] = useState(false);
  const [returning, setReturning] = useState(false);

  const handleConfirmReturn = async (return_notes?: string) => {
    try {
      setReturning(true);
      await handleReturn({ return_notes });
      setReturnOpen(false);
    } catch (err) {
      console.error("Failed to return handover", err);
    } finally {
      setReturning(false);
    }
  };

  return (
    <DashboardLayout title="Detail Serah Terima">
      {loading ? (
        <DetailSkeleton />
      ) : error || !handover ? (
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
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-medium">
                {handover.receiver?.profile?.name ?? "—"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {handover.entity} · {handover.directorate}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={handover.status === "Aktif" ? "success" : "secondary"}
              >
                {handover.status}
              </Badge>
              {handover.status === "Aktif" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReturnOpen(true)}
                >
                  <CornerDownLeft className="h-4 w-4 mr-1.5" />
                  Kembalikan
                </Button>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SectionCard title="Informasi penerima">
              <InfoRow
                icon={User}
                label="Nama penerima"
                value={handover.receiver?.profile?.name ?? "—"}
              />
              <InfoRow icon={Building} label="Entity" value={handover.entity} />
              <InfoRow
                icon={Building}
                label="Direktorat"
                value={handover.directorate}
              />
            </SectionCard>

            <SectionCard title="Tanggal & pembuat">
              <InfoRow
                icon={Calendar}
                label="Tgl handover"
                value={formatDate(handover.handover_date)}
              />
              <InfoRow
                icon={User}
                label="Dibuat oleh"
                value={handover.creator?.profile?.name ?? "—"}
              />
              <InfoRow
                icon={RefreshCw}
                label="Terakhir diupdate"
                value={formatDate(handover.updatedAt)}
              />
            </SectionCard>
          </div>

          {/* Info Pengembalian (jika sudah dikembalikan) */}
          {handover.status === "Dikembalikan" && (
            <SectionCard title="Informasi pengembalian">
              <InfoRow
                icon={Calendar}
                label="Tgl dikembalikan"
                value={formatDate(handover.returned_at)}
              />
              <InfoRow
                icon={User}
                label="Diproses oleh"
                value={handover.returner?.profile?.name ?? "—"}
              />
              <div className="flex items-start justify-between py-2">
                <span className="text-sm text-muted-foreground">Catatan</span>
                <span className="text-sm font-medium text-right max-w-xs">
                  {handover.return_notes || "—"}
                </span>
              </div>
            </SectionCard>
          )}

          {/* Daftar Aset */}
          <div className="rounded-lg border bg-card">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Daftar aset
              </p>
              <span className="text-xs text-muted-foreground">
                {handover.items?.length ?? 0} aset
              </span>
            </div>
            {handover.items && handover.items.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama aset</TableHead>
                    <TableHead>Kode aset</TableHead>
                    <TableHead>Serial number</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Kondisi</TableHead>
                    <TableHead>Keterangan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {handover.items.map((item) => (
                    <TableRow key={item.handover_item_id}>
                      <TableCell className="font-medium">
                        {item.asset.asset_name}
                      </TableCell>
                      <TableCell>{item.asset.asset_code}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {item.asset.serial_number}
                      </TableCell>
                      <TableCell>{item.asset.asset_type}</TableCell>
                      <TableCell>{item.asset.condition}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {item.notes || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Tidak ada aset
              </div>
            )}
          </div>

          {/* Return Modal */}
          <ReturnHandoverModal
            open={returnOpen}
            onClose={() => setReturnOpen(false)}
            onConfirm={handleConfirmReturn}
            loading={returning}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default DetailHandoverPage;
