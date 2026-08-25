import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  // Procurement & Borrow & Booking(Shared Statuses)
  Menunggu:
    "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
  Disetujui: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  Ditolak: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",

  // Borrow Status
  Dibatalkan: "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100",
  Dikembalikan:
    "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-100",

  // Asset Status
  Tersedia: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  Dipinjam:
    "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100",
  Diperbaiki:
    "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100",
  Diserahkan: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  Dihapus: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",

  // Asset Condition
  Baik: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  Cukup: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
  Rusak: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",

  // Maintenance
  Selesai: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  TidakDapatDiperbaiki:
    "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
  SedangDikerjakan:
    "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  MenungguVerifikasi:
    "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
  MenungguDikerjakan:
    "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100",

  // Handover Status
  Aktif: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",

  // Disposal Method
  Jual: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  Hibah: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  Kirim: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",

};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styleClass =
    statusStyles[status] ||
    "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100";

  let displayText = status;
  if (status === "TidakDapatDiperbaiki") displayText = "Tidak Dapat Diperbaiki";
  if (status === "MenungguVerifikasi") displayText = "Menunggu Verifikasi";
  if (status === "MenungguDikerjakan") displayText = "Menunggu Dikerjakan";
  if (status === "SedangDikerjakan") displayText = "Sedang Dikerjakan";

  return (
    <Badge
      variant="outline"
      className={cn("font-medium border", styleClass, className)}
    >
      {displayText}
    </Badge>
  );
}
