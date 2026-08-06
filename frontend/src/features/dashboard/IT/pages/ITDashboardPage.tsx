import { Wrench, CheckCircle, XCircle, Clock } from "lucide-react";
import StatCard from "../../admin/components/StatCard";
import DashboardSkeleton from "../../admin/components/DashboardSkeleton";
import ITMaintenanceQueue from "../components/ITMaintenanceQueue";
import { useITDashboard } from "../hooks/useITDashboard";

const ITDashboardPage = () => {
  const { data, isLoading } = useITDashboard();

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
      {/* 1. Summary Stats untuk IT */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">     
          <StatCard
          label="Antrian Dikerjakan"
          value={data.maintenance.menungguDikerjakan}
          icon={Clock} 
          colorClass="bg-orange-100 text-orange-600"
        />
        <StatCard
          label="Sedang Diperbaiki"
          value={data.maintenance.sedangDikerjakan}
          icon={Wrench} 
          colorClass="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Selesai"
          value={data.maintenance.selesai}
          icon={CheckCircle} 
          colorClass="bg-green-100 text-green-600"
        />
        <StatCard
          label="Tidak Dapat Diperbaiki"
          value={data.maintenance.tidakDapatDiperbaiki}
          icon={XCircle} 
          colorClass="bg-red-100 text-red-600"
        />
      </div>

      {/* {List Antrian Pekerjaan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 
        {/* List Antrian Pekerjaan IT (2 kolom) */}
        <div className="lg:col-span-2 rounded-xl border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Pekerjaan Terbaru (Perlu Tindakan)
            </p>
          </div>
          <ITMaintenanceQueue maintenance={data.recentActivity.maintenance} />
        </div>
      </div>

    </div>
  );
};

export default ITDashboardPage;
