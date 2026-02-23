import { StatCard } from "@/components/dashboard/StatCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { companyAssets } from "@/data/mockData";
import { Package } from "lucide-react";

export const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Aset"
          value={companyAssets.length}
          icon={Package}
          variant="primary"
        />
        <StatCard
          title="Total Aset"
          value={companyAssets.length}
          icon={Package}
          variant="primary"
        />
        <StatCard
          title="Total Aset"
          value={companyAssets.length}
          icon={Package}
          variant="primary"
        />
        <StatCard
          title="Total Aset"
          value={companyAssets.length}
          icon={Package}
          variant="primary"
        />
      </div>

    </DashboardLayout>
  );
};

export default Dashboard;
