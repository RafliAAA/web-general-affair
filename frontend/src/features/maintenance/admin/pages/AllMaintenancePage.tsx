import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

import { useAllMaintenance } from "../hooks/useAllMaintenance";

import MaintenanceQueueTable from "../components/MaintenanceQueueTable";
import MaintenanceHistoryTable from "../components/MaintenanceHistoryTable";
import MaintenanceSkeleton from "../components/MaintenanceSkeleton";

const AllMaintenancePage = () => {
  const navigate = useNavigate();

  const { queue, history, loading, error, handleVerify } = useAllMaintenance();

 if (loading) {
   return (
     <DashboardLayout title="Manajemen Maintenance">
       <MaintenanceSkeleton />
     </DashboardLayout>
   );
 }

  if (error) {
    return (
      <DashboardLayout title="Manajemen Maintenance">
        <div className="py-12 text-center text-sm text-muted-foreground">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Manajemen Maintenance">
      <div className="space-y-8">
        <MaintenanceQueueTable queue={queue} onVerify={handleVerify} />

        <MaintenanceHistoryTable
          history={history}
          onDetail={(id) => navigate(`/pemeliharaan/${id}`)}
        />
      </div>
    </DashboardLayout>
  );
};

export default AllMaintenancePage;
