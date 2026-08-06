import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
import type { RecentBorrow } from "../../../../types/dashboard";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface RecentBorrowListProps {
  borrows: RecentBorrow[];
}

const RecentBorrowList = ({ borrows }: RecentBorrowListProps) => {
  const navigate = useNavigate();

  // 1. Pastikan borrows adalah array.
  const safeBorrows = Array.isArray(borrows) ? borrows : [];

  // 2. FILTER: Hanya ambil yang statusnya "Menunggu"
  const pendingBorrows = safeBorrows.filter((b) => b.status === "Menunggu");

  // 3. Cek length dari pendingBorrows
  if (pendingBorrows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Tidak ada pengajuan peminjaman yang menunggu
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {/* 4. Map dari pendingBorrows */}
      {pendingBorrows.map((borrow) => (
        <div
          key={borrow.borrow_id}
          onClick={() => navigate(`/peminjaman`)}
          className="flex items-center justify-between py-3 first:pt-0 last:pb-0 hover:bg-muted/30 -mx-2 px-2 rounded-md cursor-pointer transition-colors group"
        >
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">
                {borrow.asset.asset_name}
              </p>
                       <StatusBadge status={borrow.status} />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="truncate">
                {borrow.user?.profile?.name ?? "Unknown"}
              </span>
              <span>•</span>
              <span className="font-mono hidden sm:inline">
                {borrow.asset.asset_code}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="shrink-0">
                {format(new Date(borrow.borrow_date), "dd MMM", { locale: id })}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground shrink-0 ml-2 transition-colors" />
        </div>
      ))}
    </div>
  );
};

export default RecentBorrowList;