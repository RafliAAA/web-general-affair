import { useNavigate } from "react-router-dom";
import {
  Package,
  ClipboardList,
  Wrench,
  PackageCheck,
  CheckCircle,
  Clock,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "../components/StatCard";
import RecentBorrowList from "../components/RecentBorrowList";
import RecentMaintenanceList from "../components/RecentMaintenanceList";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { useAdminDashboard } from "../hooks/useAdminDashboard";

const AdminDashboardPage = () => {
  const { data, isLoading } = useAdminDashboard();
  const navigate = useNavigate();

  // Hapus DashboardLayout, langsung return Skeleton saja
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-sm text-muted-foreground">
          Gagal memuat data dashboard
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    // Hapus Fragment <> yang membungkus div, langsung return div saja
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Aset"
          value={data.assets.total}
          icon={Package}
          colorClass="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Peminjaman"
          value={data.borrows.total}
          icon={ClipboardList}
          colorClass="bg-violet-100 text-violet-600"
        />
        <StatCard
          label="Maintenance"
          value={data.maintenance.total}
          icon={Wrench}
          colorClass="bg-orange-100 text-orange-600"
        />
        <StatCard
          label="Serah Terima"
          value={data.handover.aktif}
          icon={PackageCheck}
          colorClass="bg-teal-100 text-teal-600"
        />
      </div>

      {/* Asset Breakdown */}
      <div className="rounded-lg border bg-card p-5 space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Status Aset
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <div>
              <p className="text-xs text-green-700">Tersedia</p>
              <p className="text-lg font-semibold text-green-600">
                {data.assets.tersedia}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <div>
              <p className="text-xs text-green-700">Diserahkan</p>
              <p className="text-lg font-semibold text-green-600">
                {data.assets.diserahkan}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <Clock className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <p className="text-xs text-blue-700">Dipinjam</p>
              <p className="text-lg font-semibold text-blue-700">
                {data.assets.dipinjam}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <Wrench className="w-4 h-4 text-orange-600 shrink-0" />
            <div>
              <p className="text-xs text-orange-700">Diperbaiki</p>
              <p className="text-lg font-semibold text-orange-700">
                {data.assets.diperbaiki}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <Trash className="w-4 h-4 text-red-600 shrink-0" />
            <div>
              <p className="text-xs text-red-700">Dihapus</p>
              <p className="text-lg font-semibold text-red-700">
                {data.assets.dihapus}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow & Maintenance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Borrow Stats */}
        <div className="rounded-lg border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Status Peminjaman
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => navigate("/peminjaman")}
            >
              Lihat Semua
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                label: "Menunggu",
                value: data.borrows.menunggu,
                color: "text-yellow-600",
              },
              {
                label: "Disetujui",
                value: data.borrows.disetujui,
                color: "text-green-600",
              },
              {
                label: "Dikembalikan",
                value: data.borrows.dikembalikan,
                color: "text-blue-600",
              },
              {
                label: "Ditolak",
                value: data.borrows.ditolak,
                color: "text-red-600",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-2 rounded-md bg-muted/40"
              >
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
                <span className={`text-sm font-semibold ${item.color}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Stats */}
        <div className="rounded-lg border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Status Maintenance
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => navigate("/pemeliharaan")}
            >
              Lihat Semua
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                label: "Menunggu Verifikasi",
                value: data.maintenance.menungguVerifikasi,
                color: "text-yellow-600",
              },
              {
                label: "Sedang Dikerjakan",
                value: data.maintenance.sedangDikerjakan,
                color: "text-blue-600",
              },
              {
                label: "Selesai",
                value: data.maintenance.selesai,
                color: "text-green-600",
              },
              {
                label: "Tidak Dapat Diperbaiki",
                value: data.maintenance.tidakDapatDiperbaiki,
                color: "text-red-600",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-2 rounded-md bg-muted/40"
              >
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
                <span className={`text-sm font-semibold ${item.color}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Borrows */}
        <div className="rounded-lg border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Peminjaman Terbaru
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => navigate("/peminjaman")}
            >
              Lihat Semua
            </Button>
          </div>
          <RecentBorrowList borrows={data.recentActivity.borrows} />
        </div>

        {/* Recent Maintenance */}
        <div className="rounded-lg border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Maintenance Terbaru
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => navigate("/pemeliharaan")}
            >
              Lihat Semua
            </Button>
          </div>
          <RecentMaintenanceList
            maintenance={data.recentActivity.maintenance}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
