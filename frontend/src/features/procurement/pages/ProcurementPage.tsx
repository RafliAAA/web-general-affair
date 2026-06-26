import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useProcurement } from "../hooks/useProcurement";
import ProcurementTable from "../components/ProcurementTable";
import ProcurementTableSkeleton from "../components/ProcurementTableSkeleton";
import CreateProcurementModal from "../components/CreateProcurementModal";
import UpdateProcurementModal from "../components/UpdateProcurementModal";
import type { Procurement } from "../../../types/procurement"


const ProcurementPage = () => {
  const {
    procurements,
    loading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useProcurement();
  const [search, setSearch] = useState("");
  const [selectedProcurement, setSelectedProcurement] =
    useState<Procurement | null>(null);

  const filtered = procurements.filter(
    (p) =>
      p.pr_number.toLowerCase().includes(search.toLowerCase()) ||
      p.end_user.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout title="Purchase Request">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nomor PR atau end user..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <CreateProcurementModal onCreate={handleCreate} />
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          {loading ? (
            <ProcurementTableSkeleton />
          ) : error ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {error}
            </div>
          ) : (
            <ProcurementTable
              procurements={filtered}
              onEdit={setSelectedProcurement}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {selectedProcurement && (
        <UpdateProcurementModal
          procurement={selectedProcurement}
          onUpdate={handleUpdate}
          onClose={() => setSelectedProcurement(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default ProcurementPage;
