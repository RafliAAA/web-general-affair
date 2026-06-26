import { useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import HandoverStatusBadge from "./HandoverStatusBadge";
import HandoverItemsTable from "./HandoverItemsTable";
import { useAdminHandoverDetail } from "../hooks/useAdminHandover";

interface HandoverDetailSheetProps {
  handoverId: string | null;
  onClose: () => void;
}

const LabelValue = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-0.5">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-medium">{value}</p>
  </div>
);

const AdminHandoverDetailSheet = ({
  handoverId,
  onClose,
}: HandoverDetailSheetProps) => {
  const { handover, isLoading, fetchDetail } = useAdminHandoverDetail();

  useEffect(() => {
    if (handoverId) fetchDetail(handoverId);
  }, [handoverId, fetchDetail]);

  const fmt = (date: string | null) =>
    date ? format(new Date(date), "dd MMMM yyyy", { locale: id }) : "-";

  return (
    <Sheet open={!!handoverId} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Detail Handover</SheetTitle>
          <SheetDescription>
            Informasi lengkap serah terima aset
          </SheetDescription>
        </SheetHeader>

        {isLoading || !handover ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : (
          <div className="ml-4 space-y-6">
            <div className=" flex items-center gap-2">
              <HandoverStatusBadge status={handover.status} />
              <span className="text-xs text-muted-foreground font-mono truncate">
                {handover.handover_id}
              </span>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <LabelValue
                label="Tanggal Handover"
                value={fmt(handover.handover_date)}
              />
              <LabelValue label="Entity" value={handover.entity} />
              <LabelValue label="Direktorat" value={handover.directorate} />
              <LabelValue
                label="Penerima"
                value={handover.receiver.profile.name}
              />
              <LabelValue
                label="Dibuat Oleh"
                value={handover.creator.profile.name}
              />
              <LabelValue label="Dibuat Pada" value={fmt(handover.createdAt)} />
            </div>

            {handover.status === "Dikembalikan" && (
              <>
                <Separator />
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-green-700">
                    Informasi Pengembalian
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <LabelValue
                      label="Tanggal Kembali"
                      value={fmt(handover.returned_at)}
                    />
                    <LabelValue
                      label="Dikembalikan Oleh"
                      value={handover.returner?.profile.name ?? "-"}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">
                      Catatan Pengembalian
                    </p>
                    <p className="text-sm">{handover.return_notes ?? "-"}</p>
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-semibold">
                Daftar Aset ({handover.items.length} item)
              </p>
              <HandoverItemsTable items={handover.items} />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AdminHandoverDetailSheet;
