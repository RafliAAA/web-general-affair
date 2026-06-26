import { Badge } from "@/components/ui/badge";
import type { Handover } from "@/types/handover";

interface HandoverStatusBadgeProps {
  status: Handover["status"];
}

const HandoverStatusBadge = ({ status }: HandoverStatusBadgeProps) => {
  const variants: Record<string, string> = {
    Aktif: "bg-blue-100 text-blue-700 border-blue-200",
    Dikembalikan: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium px-2 py-0.5 ${variants[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </Badge>
  );
};

export default HandoverStatusBadge;
