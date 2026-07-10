import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RecentMaintenance } from "../../../../types/dashboard";

interface RecentMaintenanceListProps {
  maintenance: RecentMaintenance[];
}

const maintenanceStatusVariant: Record<
  string,
  "success" | "secondary" | "destructive" | "outline" | "warning"
> = {
  Selesai: "success",
  TidakDapatDiperbaiki: "destructive",
  Ditolak: "destructive",
  MenungguVerifikasi: "secondary",
  MenungguDikerjakan: "secondary",
  SedangDikerjakan: "warning",
};

const RecentMaintenanceList = ({ maintenance }: RecentMaintenanceListProps) => {
  const navigate = useNavigate();

  if (maintenance.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        Belum ada aktivitas maintenance
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {maintenance.map((item) => (
        <li
          key={item.maintenance_id}
          onClick={() => navigate(`/pemeliharaan/${item.maintenance_id}`)}
          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/40 transition-colors cursor-pointer group"
        >
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium truncate">
                {item.asset.asset_name}
              </p>
              <Badge
                variant={maintenanceStatusVariant[item.status] ?? "outline"}
              >
                {item.status === "TidakDapatDiperbaiki"
                  ? "Tidak Dapat Diperbaiki"
                  : item.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{item.reporter.profile.name}</span>
              <span>·</span>
              <span className="font-mono">{item.asset.asset_code}</span>
              <span>·</span>
              <span>
                {format(new Date(item.createdAt), "dd MMM yyyy", {
                  locale: id,
                })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {item.description}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </li>
      ))}
    </ul>
  );
};

export default RecentMaintenanceList;
