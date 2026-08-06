import { useNavigate } from "react-router-dom";
// HAPUS import DashboardLayout dari sini

import { useAllMaintenance } from "../hooks/useAllMaintenance";

import MaintenanceQueueTable from "../components/MaintenanceQueueTable";
import MaintenanceHistoryTable from "../components/MaintenanceHistoryTable";
import MaintenanceSkeleton from "../components/MaintenanceSkeleton";

const AllMaintenancePage = () => {
  const navigate = useNavigate();

  const { queue, history, loading, error, handleVerify } = useAllMaintenance();

  // UBAH INI: Hapus DashboardLayout, langsung return Skeleton
  if (loading) {
    return <MaintenanceSkeleton />;
  }

  if (error) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <MaintenanceQueueTable queue={queue} onVerify={handleVerify} />

      <MaintenanceHistoryTable
        history={history}
        onDetail={(id) => navigate(`/pemeliharaan/${id}`)}
      />
    </div>
  );
};

export default AllMaintenancePage;
