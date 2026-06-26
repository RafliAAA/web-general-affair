import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useDisposal } from "../hooks/useDisposal";
import DisposalTable from "../components/DisposalTable";
import DisposalTableSkeleton from "../components/DisposalTableSkeleton";
import CreateDisposalModal from "../components/CreateDisposalModal";
import type { Disposal } from "../services/disposalService";

const DisposalPage = () => {
  const { disposals, loading, error, handleCreate, handleDelete } = useDisposal();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = disposals.filter(
    (d) =>
      d.memo_number.toLowerCase().includes(search.toLowerCase()) ||
      d.subject.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreated = (disposal: Disposal) => {
    navigate(`/disposal/${disposal.disposal_id}`);
  };

  return (
    <DashboardLayout title="Disposal Aset">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nomor memo atau subjek..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <CreateDisposalModal onCreate={handleCreate} onCreated={handleCreated} />
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          {loading ? (
            <DisposalTableSkeleton />
          ) : error ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {error}
            </div>
          ) : (
            <DisposalTable disposals={filtered} onDelete={handleDelete} />
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default DisposalPage;