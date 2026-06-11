import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useBorrowAdmin } from "../hooks/useBorrowAdmin";
import BorrowTable from "../components/BorrowTable";
import BorrowTableSkeleton from "../components/BorrowTableSkeleton";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { Package } from "lucide-react";

const STATUS_FILTER = ["Semua", "Menunggu", "Disetujui", "Ditolak"];

const AdminBorrowPage = () => {
  const { borrows, loading, error, handleApprove, handleReject } = useBorrowAdmin();
  const [statusFilter, setStatusFilter] = useState("Semua");

  const filtered = borrows.filter((b) =>
    statusFilter === "Semua" ? true : b.status === statusFilter,
  );

  const pendingCount = borrows.filter((b) => b.status === "Menunggu").length;

  return (
    <DashboardLayout title="Pengajuan Peminjaman">
      <div className="space-y-6">
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                  title="Menunggu"
                  value={pendingCount}
                  icon={Package}
                  variant="primary"
                />
                <StatCard
                  title="Disetujui"
                  value={borrows.filter((b) => b.status === "Disetujui").length}
                  icon={Package}
                  variant="primary"
                />
                <StatCard
                  title="Ditolak"
                  value={borrows.filter((b) => b.status === "Ditolak").length}
                  icon={Package}
                  variant="primary"
                />
         </div>

        {/* Header */}
        <div className="flex items-center justify-between">

          {/* Filter Status */}
          <div className="flex gap-2 flex-wrap justify-end">
            {STATUS_FILTER.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={statusFilter === s ? "default" : "outline"}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          {loading ? (
            <BorrowTableSkeleton />
          ) : error ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {error}
            </div>
          ) : (
            <BorrowTable
              borrows={filtered}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminBorrowPage;