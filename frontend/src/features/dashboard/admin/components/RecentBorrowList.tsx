import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RecentBorrow } from "../../../../types/dashboard";

interface RecentBorrowListProps {
  borrows: RecentBorrow[];
}

const borrowStatusVariant: Record<
  string,
  "success" | "secondary" | "destructive" | "outline"
> = {
  Disetujui: "success",
  Dikembalikan: "outline",
  Ditolak: "destructive",
  Dibatalkan: "destructive",
  Menunggu: "secondary",
};

const RecentBorrowList = ({ borrows }: RecentBorrowListProps) => {
  const navigate = useNavigate();

  if (borrows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        Belum ada aktivitas peminjaman
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {borrows.map((borrow) => (
        <li
          key={borrow.borrow_id}
          onClick={() => navigate(`/peminjaman`)}
          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/40 transition-colors cursor-pointer group"
        >
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium truncate">
                {borrow.asset.asset_name}
              </p>
              <Badge variant={borrowStatusVariant[borrow.status] ?? "outline"}>
                {borrow.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{borrow.user.profile.name}</span>
              <span>·</span>
              <span className="font-mono">{borrow.asset.asset_code}</span>
              <span>·</span>
              <span>
                {format(new Date(borrow.borrow_date), "dd MMM yyyy", {
                  locale: id,
                })}
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </li>
      ))}
    </ul>
  );
};

export default RecentBorrowList;
