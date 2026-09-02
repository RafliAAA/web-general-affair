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
  Printer, // 🌟 Import ikon Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssetDetail } from "../hooks/useAssetDetail";
import DetailAssetSkeleton from "../components/DetailAssetSkeleton";
import UpdateAssetModal from "../components/UpdateAssetModal";
import AssetLabel from "../components/AssetLabel"; // 🌟 Import komponen Label
import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print"; // 🌟 Import hook print
import type { Borrow } from "@/types/inventory";
import BorrowHistoryTable from "../components/BorrowHistoryTable";
import MaintenanceHistoryTable from "../components/MaintenanceHistoryTable";
import HandoverHistoryTable from "../components/HandoverHistoryTable";
import type { HandoverItem } from "@/types/handover";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getCurrentUser = (
  borrow: Borrow[],
  handoverItems: HandoverItem[],
): string => {
  const activeBorrow = borrow?.find(
    (b) => b.status === "Dipinjam" || b.status === "Disetujui",
  );
  if (activeBorrow) {
    return activeBorrow.user?.profile?.name ?? "—";
  }

  const activeHandover = handoverItems?.find(
    (h) => h.handover?.status === "Aktif",
  );
  if (activeHandover) {
    return activeHandover.handover?.receiver?.profile?.name ?? "—";
  }

  return "—";
};

const DetailAsset = () => {
  const { id } = useParams<{ id: string }>();
  const [editOpen, setEditOpen] = useState(false);
  const navigate = useNavigate();
  const { asset, loading, error, handleUpdate } = useAssetDetail(id);

  const { user } = useAuthStore();

  const maintenances = asset?.maintenances || [];
  const handoverItems = asset?.handoverItems || [];

  const canManageAsset = user?.role === "ADMIN" || user?.role === "IT";

  const labelRef = useRef(null);
  const handlePrintLabel = useReactToPrint({
    contentRef: labelRef, 
    documentTitle: `Label-${asset?.asset_code}`,
  });

  return (
    <>
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
                {asset.asset_code} .{" "}
                {asset.asset_category?.category_name ?? "—"}
              </p>
            </div>

            <div className="flex gap-2">
              {/* 🌟 TOMBOL PRINT LABEL */}
              <Button variant="outline" size="sm" onClick={handlePrintLabel}>
                <Printer className="h-4 w-4 mr-1.5" />
                Print Label
              </Button>

              {/* HANYA ADMIN & IT YANG BISA LIHAT TOMBOL EDIT */}
              {canManageAsset && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-1.5" />
                  Edit
                </Button>
              )}
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
                {
                  icon: Hash,
                  label: "Spesifikasi",
                  value: asset.specification,
                },
                {
                  icon: Package,
                  label: "Kategori",
                  value: asset.asset_category?.category_name ?? "—",
                },
                {
                  icon: User,
                  label: "Pengguna saat ini",
                  value:
                    getCurrentUser(asset.borrow, asset.handoverItems || []) ??
                    "—",
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
                  <StatusBadge status={asset.status} />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Kondisi</span>
                  <StatusBadge status={asset.condition} />
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

          {/* HANYA ADMIN & IT YANG BISA LIHAT RIWAYAT LENGKAP */}
          {canManageAsset && (
            <>
              <BorrowHistoryTable borrows={asset.borrow} />
              <MaintenanceHistoryTable maintenances={maintenances} />
              <HandoverHistoryTable handoverItems={handoverItems} />
            </>
          )}

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

          <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
            <AssetLabel ref={labelRef} asset={asset} />
          </div>
        </div>
      )}
    </>
  );
};

export default DetailAsset;
