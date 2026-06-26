import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Hash,
  Edit,
  Plus,
  Trash2,
  Download,
} from "lucide-react"; // Tambah Download icon
import { PDFDownloadLink } from "@react-pdf/renderer"; // Import dari react-pdf
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useDisposalDetail } from "../hooks/useDisposalDetail";
import AddDisposalItemModal from "../components/AddDisposalItemModal";
import UpdateDisposalMemoModal from "../components/UpdateDisposalMemoModal";
import DisposalPDF from "../components/DisposalPdf"; 

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const methodVariant = (method: string) => {
  switch (method) {
    case "Hibah":
      return "secondary";
    case "Jual":
      return "success";
    case "Musnahkan":
      return "destructive";
    case "Tukar Tambah":
      return "outline";
    default:
      return "outline";
  }
};

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
    <div className="space-y-2">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-5 space-y-3">
          <Skeleton className="h-3 w-24" />
          {Array.from({ length: 3 }).map((_, j) => (
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

const DetailDisposalPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    disposal,
    loading,
    error,
    handleUpdate,
    handleAddItems,
    handleRemoveItem,
  } = useDisposalDetail(id);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editMemoOpen, setEditMemoOpen] = useState(false);

  return (
    <DashboardLayout title="Detail Disposal">
      {loading ? (
        <DetailSkeleton />
      ) : error || !disposal ? (
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
              <h1 className="text-xl font-medium">{disposal.subject}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {disposal.memo_number}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* TOMBOL EXPORT PDF */}
              <PDFDownloadLink
                document={<DisposalPDF disposal={disposal} />}
                fileName={`Disposal-${disposal.memo_number.replace(/[/\\?%*:|"<>\s]/g, "-")}.pdf`}
              >
                {({ loading: pdfLoading }) => (
                  <Button variant="outline" size="sm" disabled={pdfLoading}>
                    <Download className="h-4 w-4 mr-1.5" />
                    {pdfLoading ? "Menyiapkan PDF..." : "Export PDF"}
                  </Button>
                )}
              </PDFDownloadLink>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMemoOpen(true)}
              >
                <Edit className="h-4 w-4 mr-1.5" />
                Edit memo
              </Button>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SectionCard title="Informasi memo">
              <InfoRow
                icon={Hash}
                label="Nomor memo"
                value={disposal.memo_number}
              />
              <InfoRow
                icon={Calendar}
                label="Tanggal memo"
                value={formatDate(disposal.memo_date)}
              />
            </SectionCard>

            <SectionCard title="Deskripsi">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {disposal.description || "—"}
              </p>
            </SectionCard>
          </div>

          {/* Items */}
          <div className="rounded-lg border bg-card">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Aset yang didisposal
                </p>
                <span className="text-xs text-muted-foreground">
                  {disposal.items?.length ?? 0} aset
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAddItemOpen(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Tambah aset
              </Button>
            </div>
            {disposal.items && disposal.items.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama aset</TableHead>
                    <TableHead>Kode aset</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Metode</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disposal.items.map((item) => (
                    <TableRow key={item.disposal_item_id}>
                      <TableCell className="font-medium">
                        {item.asset.asset_name}
                      </TableCell>
                      <TableCell>{item.asset.asset_code}</TableCell>
                      <TableCell>{item.asset.asset_type}</TableCell>
                      <TableCell>
                        <Badge
                          variant={methodVariant(item.method)}
                          className="text-xs"
                        >
                          {item.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {item.notes || "—"}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 h-7 px-2"
                          onClick={() => handleRemoveItem(item.asset_id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Belum ada aset, klik "Tambah aset" untuk menambahkan
              </div>
            )}
          </div>

          {/* Add Item Modal */}
          <AddDisposalItemModal
            open={addItemOpen}
            onClose={() => setAddItemOpen(false)}
            onSubmit={handleAddItems}
            excludedIds={disposal.items?.map((i) => i.asset_id) ?? []}
          />

          {/* Edit Memo Modal */}
          {editMemoOpen && (
            <UpdateDisposalMemoModal
              disposal={disposal}
              onUpdate={handleUpdate}
              onClose={() => setEditMemoOpen(false)}
            />
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DetailDisposalPage;
