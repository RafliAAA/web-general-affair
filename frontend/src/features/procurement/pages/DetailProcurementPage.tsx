import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Calendar, User, FileText, Hash, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useProcurementDetail } from "../hooks/useProcurementDetail";
import { updateProcurement } from "../services/ProcurementService";
import UpdateProcurementModal from "../components/UpdateProcurementModal";
import type { CreateProcurementPayload } from "../../../types/procurement";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

// ─── Sub-components ───────────────────────────────────────────────────────────

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between py-2 border-b last:border-0">
    <span className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-lg border bg-card p-5 space-y-3">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
      {title}
    </p>
    {children}
  </div>
);



const DetailSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-4 w-20" />
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-28" />
      </div>
      <Skeleton className="h-8 w-16" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-5 space-y-3">
          <Skeleton className="h-3 w-24" />
          {Array.from({ length: 4 }).map((_, j) => (
            <div
              key={j}
              className="flex justify-between py-2 border-b last:border-0"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const DetailProcurementPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { procurement, loading, error, handleUpdate, handleExport, exporting } =
    useProcurementDetail(id);
  const [editOpen, setEditOpen] = useState(false);


  const handleSave = async (
    procId: string,
    payload: Partial<CreateProcurementPayload>,
  ) => {
    const updated = await updateProcurement(procId, payload);
    handleUpdate(updated);
  };

 


  return (
    <DashboardLayout title="Detail Purchase Request">
      {loading ? (
        <DetailSkeleton />
      ) : error || !procurement ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <p className="text-sm text-muted-foreground">
            {error ?? "Data tidak ditemukan"}
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            Kembali
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-medium">{procurement.pr_number}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {procurement.end_user}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={exporting}
              >
                <FileDown className="h-4 w-4 mr-1.5" />
                {exporting ? "Generating..." : "Export PDF"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
              >
                <Edit className="h-4 w-4 mr-1.5" />
                Edit
              </Button>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SectionCard title="Informasi PR">
              <InfoRow
                icon={Hash}
                label="Nomor PR"
                value={procurement.pr_number}
              />
              <InfoRow
                icon={User}
                label="End user"
                value={procurement.end_user}
              />
              <InfoRow
                icon={FileText}
                label="Keterangan"
                value={procurement.remarks || "—"}
              />
            </SectionCard>

            <SectionCard title="Tanggal">
              <InfoRow
                icon={Calendar}
                label="Tanggal PR"
                value={formatDate(procurement.pr_date)}
              />
              <InfoRow
                icon={Calendar}
                label="Tanggal cetak"
                value={formatDate(procurement.print_date)}
              />
              <InfoRow
                icon={Calendar}
                label="Jatuh tempo"
                value={formatDate(procurement.due_date)}
              />
            </SectionCard>
          </div>

          {/* Items */}
          <div className="rounded-lg border bg-card">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Item pengadaan
              </p>
              <span className="text-xs text-muted-foreground">
                {procurement.items?.length ?? 0} item
              </span>
            </div>
            {procurement.items && procurement.items.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Part number</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Satuan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {procurement.items.map((item, index) => (
                    <TableRow key={item.procurement_item_id}>
                      <TableCell className="text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.part_number}
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit_of_measure}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Tidak ada item
              </div>
            )}
          </div>

          {/* Edit Modal */}
          {editOpen && (
            <UpdateProcurementModal
              procurement={procurement}
              onUpdate={handleSave}
              onClose={() => setEditOpen(false)}
            />
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DetailProcurementPage;
