import { useNavigate } from "react-router-dom";
import {
  Package,
  Wrench,
  Clock,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardSkeleton from "../../admin/components/DashboardSkeleton"; // Sesuaikan path
import { useUserDashboard } from "../hooks/useUserDashboard"; // Kita buat hook ini
import RecentMyMaintenanceList from "../components/RecentMyMaintenanceList";
import RecentMyBorrowList from "../components/RecentMyBorrowList";
import StatCard from "../../admin/components/StatCard";

const UserDashboardPage = () => {
  const { data, isLoading } = useUserDashboard();
  const navigate = useNavigate();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return (
      <div className="text-center text-sm text-muted-foreground py-12">
        Gagal memuat data dashboard
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Aset Saya"
          value={data.myAssets.aktif}
          icon={Package}
          colorClass="bg-teal-100 text-teal-600"
        />
        <StatCard
          label="Peminjaman Aktif"
          value={data.myBorrows.disetujui}
          icon={ArrowRightLeft}
          colorClass="bg-violet-100 text-violet-600"
        />
        <StatCard
          label="Pengajuan Menunggu"
          value={data.myBorrows.menunggu}
          icon={Clock}
          colorClass="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          label="Laporan Kerusakan"
          value={data.myMaintenance.proses}
          icon={Wrench}
          colorClass="bg-orange-100 text-orange-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent Borrows */}
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Peminjaman Saya Terbaru
            </p>
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => navigate("/pengajuan")}>
              Lihat Semua
            </Button>
          </div>
          {/* Ganti komponen di sini */}
          <RecentMyBorrowList borrows={data.recentActivity.borrows} />
        </div>

        {/* Recent Maintenance */}
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Laporan Kerusakan Saya
            </p>
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => navigate("/lapor-kerusakan")}>
              Lihat Semua
            </Button>
          </div>
          {/* Ganti komponen di sini */}
          <RecentMyMaintenanceList maintenance={data.recentActivity.maintenance} />
        </div>
    </div>
    </div>
  );
};

export default UserDashboardPage;
