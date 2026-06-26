import { Badge } from "@/components/ui/badge";

type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning";

const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  MenungguVerifikasi: { label: "Menunggu Verifikasi", variant: "secondary" },
  MenungguDikerjakan: { label: "Menunggu Dikerjakan", variant: "warning" },
  SedangDikerjakan: { label: "Sedang Dikerjakan", variant: "default" },
  Selesai: { label: "Selesai", variant: "success" },
  Ditolak: { label: "Ditolak", variant: "destructive" },
  TidakDapatDiperbaiki: {
    label: "Tidak Dapat Diperbaiki",
    variant: "destructive",
  },
};

const MaintenanceStatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status] ?? {
    label: status,
    variant: "outline" as BadgeVariant,
  };
  return (
    <Badge variant={config.variant} className="text-xs">
      {config.label}
    </Badge>
  );
};

export default MaintenanceStatusBadge;
