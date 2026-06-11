import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useReturn } from "../hooks/useReturn";
import ReturnTable from "../components/ReturnTable";
import ReturnTableSkeleton from "../components/ReturnTableSkeleton";
import ReturnModal from "../components/ReturnModal";
import type {
  BorrowRequest,
  CreateReturnPayload,
} from "../services/returnService";


const ReturnPage = () => {
  const { borrows, loading, error, handleReturn } = useReturn();
  const [selectedBorrow, setSelectedBorrow] = useState<BorrowRequest | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async (payload: CreateReturnPayload) => {
    try {
      setSubmitting(true);
      await handleReturn(payload);
      setSelectedBorrow(null);
    } catch (err) {
      console.error("Failed to process return", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Pengembalian Aset">
      <div className="space-y-6">

        {/* Summary */}
        {!loading && borrows.length > 0 && (
          <p className="text-sm text-muted-foreground bg-blend-color-burn rounded-md border border-secondary bg-secondary/50 px-3 py-1 w-fit">
            {borrows.length} aset sedang dipinjam
          </p>
        )}

        {/* Table */}
        <div className="rounded-lg border bg-card">
          {loading ? (
            <ReturnTableSkeleton />
          ) : error ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {error}
            </div>
          ) : (
            <ReturnTable borrows={borrows} onReturn={setSelectedBorrow} />
          )}
        </div>
      </div>

      {/* Return Modal */}
      {selectedBorrow && (
        <ReturnModal
          borrow={selectedBorrow}
          onConfirm={handleConfirm}
          onClose={() => setSelectedBorrow(null)}
          loading={submitting}
        />
      )}
    </DashboardLayout>
  );
};

export default ReturnPage;
