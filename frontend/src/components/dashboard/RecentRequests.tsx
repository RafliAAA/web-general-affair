import { Badge } from "@/components/ui/badge";
import type { BorrowRequest } from "../../types/inventory";
import { cn } from "@/lib/utils";

interface RecentRequestsProps {
  requests: BorrowRequest[];
}

export function RecentRequests({ requests }: RecentRequestsProps) {
  const statusStyles = {
    pending: "status-pending",
    approved: "status-approved",
    rejected: "status-rejected",
  };

  const statusLabels = {
    pending: "Menunggu",
    approved: "Disetujui",
    rejected: "Ditolak",
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          Permintaan Terbaru
        </h3>
      </div>
      <div className="divide-y divide-border">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between px-6 py-4"
          >
            <div className="flex-1">
              <p className="font-medium text-card-foreground">
                {request.assetName}
              </p>
              <p className="text-sm text-muted-foreground">
                {request.requestedByName} •{" "}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn("border", statusStyles[request.status])}
            >
              {statusLabels[request.status]}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
