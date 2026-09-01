import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Users,
  Calendar,
  Package,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBorrowDetail } from "../hooks/useBorrowDetail";
import { StatusBadge } from "../../../../components/shared/StatusBadge";

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
    <span className="text-sm font-medium text-right">{value}</span>
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

const DetailBorrowPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { borrow, loading, error } = useBorrowDetail(id);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !borrow) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-sm text-muted-foreground">
          {error ?? "Data tidak ditemukan"}
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Kembali
        </Button>
      </div>
    );
  }

  const returnData = borrow.returns?.[0];

  return (
    <div className="space-y-6">
      {/* Back & Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-medium">
            {borrow?.asset?.asset_name ?? "—"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {borrow?.asset?.asset_code ?? "—"} ·{" "}
            {borrow?.asset?.asset_category?.category_name ?? "—"}
          </p>
        </div>
        <StatusBadge status={borrow.status} />
      </div>

      {/* Info Grid */}
      <div className="grid gap-4">
        {/* Info Peminjam */}
        <SectionCard title="Informasi Peminjaman">
          <InfoRow
            icon={User}
            label="Dipinjam oleh"
            value={borrow.user?.profile?.name ?? "—"}
          />
          <InfoRow
            icon={Users}
            label="Tipe Peminjaman"
            value={borrow.recipient_type ?? "Personal"}
          />
          <InfoRow icon={Package} label="Alasan" value={borrow.borrow_reason} />
          <InfoRow
            icon={Calendar}
            label="Tanggal Pinjam"
            value={formatDate(borrow.createdAt)}
          />
          {/* 🌟 TAMBAHKAN BARIS TANGGAL DIAMBIL DI SINI */}
          <InfoRow
            icon={Calendar}
            label="Tanggal Diambil"
            value={formatDate(borrow.taken_date ?? null)}
          />
          <InfoRow
            icon={Calendar}
            label="Rencana Kembali"
            value={formatDate(borrow.expected_return_date)}
          />
          {borrow.status === "Ditolak" ? (
            <InfoRow
              icon={XCircle}
              label="Ditolak oleh"
              value={borrow.approver?.profile?.name ?? "—"}
            />
          ) : (
            <InfoRow
              icon={CheckCircle}
              label="Disetujui oleh"
              value={borrow.approver?.profile?.name ?? "—"}
            />
          )}
        </SectionCard>
      </div>

      {/* Info Pengembalian (Hanya muncul kalau sudah dikembalikan) */}
      <SectionCard title="Informasi Pengembalian">
        {returnData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow
              icon={Calendar}
              label="Tanggal Dikembalikan"
              value={formatDate(returnData.return_date)}
            />
            <InfoRow
              icon={CheckCircle}
              label="Kondisi Saat Kembali"
              value={<StatusBadge status={returnData.return_condition} />}
            />
            <InfoRow
              icon={User}
              label="Diterima oleh"
              value={borrow.approver?.profile?.name ?? "—"}
            />
            <InfoRow
              icon={Package}
              label="Catatan"
              value={returnData.notes ?? "—"}
            />
          </div>
        ) : (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Aset belum dikembalikan
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default DetailBorrowPage;
