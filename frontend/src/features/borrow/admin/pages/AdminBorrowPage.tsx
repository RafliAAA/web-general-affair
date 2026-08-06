import { useState } from "react";
import { useBorrowAdmin } from "../hooks/useBorrowAdmin";
import BorrowTable from "../components/BorrowTable";
import BorrowTableSkeleton from "../components/BorrowTableSkeleton";
import ReturnModal from "../../../return/components/ReturnModal"; 
import { createReturn } from "../../../return/services/returnService";
import type { BorrowRequest, CreateReturnPayload } from "../../../return/services/returnService";
import { toast } from "sonner";

// Komponen Section agar tampilannya rapi
const Section = ({ title, count, children }: { title: string, count: number, children: React.ReactNode }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <p className="text-sm font-medium">{title}</p>
      {count > 0 && (
        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
          {count}
        </span>
      )}
    </div>
    <div className="rounded-lg border bg-card">
      {children}
    </div>
  </div>
);

const AdminBorrowPage = () => {
  // Pastikan fetchBorrows ada di hook kamu untuk refresh data
  const { borrows, loading, error, handleApprove, handleReject, fetchBorrows } = useBorrowAdmin();
  
  // State untuk modal return
  const [returnTarget, setReturnTarget] = useState<BorrowRequest | null>(null);
  const [isReturning, setIsReturning] = useState(false);

  // Fungsi untuk handle pengembalian langsung di halaman ini
  const handleReturnSubmit = async (payload: CreateReturnPayload) => {
    setIsReturning(true);
    try {
      await createReturn(payload);
      toast.success("Aset berhasil dikembalikan!");
      setReturnTarget(null); 
      fetchBorrows(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengembalikan aset");
    } finally {
      setIsReturning(false);
    }
  };

  if (loading) return <BorrowTableSkeleton />;
  if (error) return <div className="py-12 text-center text-sm text-muted-foreground">{error}</div>;

  // Filter data menjadi 3 bagian
  const queue = borrows.filter((b) => b.status === "Menunggu");
  const active = borrows.filter((b) => b.status === "Disetujui");
  const history = borrows.filter((b) => ["Dikembalikan", "Ditolak", "Dibatalkan"].includes(b.status));

  return (
    <>
      <div className="space-y-8">

        {/* Antrian Peminjaman */}
        <Section title="Antrian Peminjaman" count={queue.length}>
          <BorrowTable 
            borrows={queue} 
            onApprove={handleApprove} 
            onReject={handleReject} 
          />
        </Section>

        {/* Sedang Dipinjam */}
        <Section title="Sedang Dipinjam" count={active.length}>
          <BorrowTable 
            borrows={active} 
            onReturn={(b) => setReturnTarget(b)} 
          />
        </Section>

        {/* Riwayat Peminjaman */}
        <Section title="Riwayat Peminjaman" count={history.length}>
          <BorrowTable borrows={history} />
        </Section>
      </div>

      {/* MODAL PENGEMBALIAN ASEET (Hanya muncul jika returnTarget ada) */}
      {returnTarget && (
        <ReturnModal
          borrow={returnTarget}
          onConfirm={handleReturnSubmit}
          onClose={() => setReturnTarget(null)}
          loading={isReturning}
        />
      )}
    </>
  );
};

export default AdminBorrowPage;