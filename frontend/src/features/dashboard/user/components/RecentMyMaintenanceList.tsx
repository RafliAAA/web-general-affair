import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
import type { RecentMaintenance } from "../services/userDashboardService";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface Props {
  maintenance: RecentMaintenance[];
}

const RecentMyMaintenanceList = ({ maintenance }: Props) => {
  const navigate = useNavigate();

  if (maintenance.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Belum ada riwayat laporan kerusakan
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {maintenance.map((item) => (
        <div
          key={item.maintenance_id}
          onClick={() => navigate(`/lapor-kerusakan/${item.maintenance_id}`)}
          className="flex items-center justify-between py-3 first:pt-0 last:pb-0 hover:bg-muted/30 -mx-2 px-2 rounded-md cursor-pointer transition-colors group"
        >
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">
                {item.asset.asset_name}
              </p>
              <StatusBadge status={item.status} />
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {item.description}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-mono hidden sm:inline">
                {item.asset.asset_code}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="shrink-0">
                {format(new Date(item.createdAt), "dd MMM yyyy", {
                  locale: id,
                })}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground shrink-0 ml-2 transition-colors" />
        </div>
      ))}
    </div>
  );
};

export default RecentMyMaintenanceList;
