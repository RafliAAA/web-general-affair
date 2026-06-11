import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Package,
  Tag,
  Hash,
  Calendar,
  RefreshCw,
  ShieldCheck,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useAssetDetail } from "../hooks/useAssetDetail";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DetailAssetSkeleton from "../components/DetailAssetSkeleton";
import UpdateAssetModal from "../components/UpdateAssetModal";
import { useState } from "react";
import type { Borrow } from "@/types/inventory";

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusVariant = (status: string) => {
  switch (status) {
    case "Tersedia":
      return "success";
    case "Dipinjam":
      return "secondary";
    case "Diperbaiki":
      return "outline";
    default:
      return "destructive";
  }
};

const borrowStatusVariant = (status: string) => {
  switch (status) {
    case "Dikembalikan":
      return "success";
    case "Disetujui":
      return "secondary";
    case "Menunggu":
      return "outline";
    case "Ditolak":
      return "destructive";
    case "Dibatalkan":
      return "destructive";
    default:
      return "outline";
  }
};

const getCurrentBorrow = (borrow: Borrow[]) => {
  return borrow?.find(
    (b) => b.status === "Dipinjam" || b.status === "Disetujui",
  );
};

const DetailAsset = () => {
  const { id } = useParams<{ id: string }>();
  const [editOpen, setEditOpen] = useState(false);
  const navigate = useNavigate();
  const { asset, loading, error, handleUpdate } = useAssetDetail(id);

  return (
    <DashboardLayout title="Detail Aset">
      {loading ? (
        <DetailAssetSkeleton />
      ) : error || !asset ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <p className="text-sm text-muted-foreground">
            {error ?? "Aset tidak ditemukan"}
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
            <ArrowLeft className="h-4 w-4 " />
            Kembali
          </button>

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-medium">{asset.asset_name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {asset.asset_code} . {asset.asset_type}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
              >
                <Edit className="h-4 w-4 mr-1.5" />
                Edit
              </Button>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Informasi Aset */}
            <div className="rounded-lg border bg-card p-5 space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Informasi aset
              </p>
              {[
                { icon: Package, label: "Nama aset", value: asset.asset_name },
                { icon: Tag, label: "Kode aset", value: asset.asset_code },
                {
                  icon: Hash,
                  label: "Serial number",
                  value: asset.serial_number,
                },
                { icon: Package, label: "Kategori", value: asset.asset_type },
                {
                  icon: User,
                  label: "Pengguna saat ini",
                  value:
                    getCurrentBorrow(asset.borrow)?.user?.profile?.name ?? "—",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </span>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {/* Status & Kondisi */}
              <div className="rounded-lg border bg-card p-5 space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Status & kondisi
                </p>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={statusVariant(asset.status)}>
                    {asset.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Kondisi</span>
                  <Badge
                    variant={
                      asset.condition === "Baik"
                        ? "success"
                        : asset.condition === "Cukup Baik"
                          ? "outline"
                          : "destructive"
                    }
                  >
                    {asset.condition}
                  </Badge>
                </div>
              </div>

              {/* Tanggal */}
              <div className="rounded-lg border bg-card p-5 space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Tanggal
                </p>
                {[
                  {
                    icon: Calendar,
                    label: "Tanggal pembelian",
                    value: formatDate(asset.purchase_date),
                  },
                  {
                    icon: ShieldCheck,
                    label: "Tanggal garansi",
                    value: formatDate(asset.warranty_date),
                  },
                  {
                    icon: RefreshCw,
                    label: "Terakhir diupdate",
                    value: formatDate(asset.updatedAt),
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Riwayat Peminjaman */}
          <div className="rounded-lg border bg-card">
            <div className="px-5 py-4 border-b">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Riwayat peminjaman
              </p>
            </div>
            {asset.borrow.length > 0 ? (
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
                  {asset.borrow.map((b) => {
                    const returnData = b.returns?.[0];
                    return (
                      <TableRow key={b.borrow_id}>
                        <TableCell className="font-medium">
                          {b.user?.profile?.name ?? "—"}
                        </TableCell>
                        <TableCell>{formatDate(b.createdAt)}</TableCell>
                        <TableCell>
                          {formatDate(b.expected_return_date)}
                        </TableCell>
                        <TableCell>
                          {returnData
                            ? formatDate(returnData.return_date)
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {returnData?.return_condition ? (
                            <Badge
                              variant={
                                returnData.return_condition === "Baik"
                                  ? "success"
                                  : returnData.return_condition === "Cukup Baik"
                                    ? "outline"
                                    : "destructive"
                              }
                            >
                              {returnData.return_condition}
                            </Badge>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={borrowStatusVariant(b.status)}>
                            {b.status}
                          </Badge>
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

          {/* Riwayat Pemeliharaan */}
          <div className="rounded-lg border bg-card">
            <div className="px-5 py-4 border-b">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Riwayat Pemeliharaan
              </p>
            </div>

            <div className="py-12 text-center text-sm text-muted-foreground">
              Belum ada riwayat pemeliharaan
            </div>
          </div>
          {editOpen && (
            <UpdateAssetModal
              asset={asset}
              onUpdate={async (id, data) => {
                await handleUpdate(id, data);
                setEditOpen(false);
              }}
              onClose={() => setEditOpen(false)}
            />
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DetailAsset;
