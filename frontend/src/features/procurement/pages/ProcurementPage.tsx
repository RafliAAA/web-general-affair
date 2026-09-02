import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  User,
  Eye,
  MoreHorizontal,
  Plus,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { useProcurement } from "../hooks/useProcurement";
import ProcurementTable from "../components/ProcurementTable";
import ProcurementTableSkeleton from "../components/ProcurementTableSkeleton";
import UpdateProcurementModal from "../components/UpdateProcurementModal";
import CreateProcurementModal from "../components/CreateProcurementModal";
import type {
  Procurement,
  CreateProcurementPayload,
} from "../../../types/procurement";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ProcurementPage = () => {
  const navigate = useNavigate();
  const {
    procurements,
    loading,
    error,
    handleCreate,
    handleUpdate,
    fetchProcurements,
  } = useProcurement();

  const [selectedProcurement, setSelectedProcurement] =
    useState<Procurement | null>(null);

  // State untuk List Aktualisasi & Modal Detail
  const [actualizations, setActualizations] = useState<any[]>([]);
  const [loadingActual, setLoadingActual] = useState(true);
  const [selectedActualization, setSelectedActualization] = useState<
    any | null
  >(null);

  // State untuk Modal Create PR
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedActualForPR, setSelectedActualForPR] = useState<any | null>(
    null,
  );

  // 🌟 KELUARKAN FETCH AKTUALISASI JADI USECALLBACK
  const fetchActualizations = useCallback(async () => {
    setLoadingActual(true);
    try {
      const res = await api.get("/maintenance/actualizations");
      setActualizations(res.data.data || []);
    } catch (err) {
      console.error("Gagal fetch actualizations:", err);
    } finally {
      setLoadingActual(false);
    }
  }, []);

  useEffect(() => {
    fetchActualizations();
  }, [fetchActualizations]);

  // FILTER PENGADAAN
  // Kita pakai semua procurements agar yang Menunggu & Disetujui muncul di tabel bawah
  const allProcurements = procurements;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Fungsi Buka Modal Create PR
  const handleOpenCreatePR = (act: any) => {
    setSelectedActualForPR(act);
    setCreateModalOpen(true);
  };

  // 🌟 FUNGSI WRAPPER UNTUK CREATE PR
  // Setelah PR dibuat, refresh tabel SVC dan Tabel Pengadaan
  const handleCreatePRFromSVC = async (payload: CreateProcurementPayload) => {
    await handleCreate(payload);
    fetchActualizations(); // Refresh list SVC agar SVC yg dibuat PR hilang
    fetchProcurements(); // Pastikan tabel pengadaan juga update
  };

  // Fungsi Lihat Detail PR
  const handleViewProcurement = (id: string) => {
    navigate(`/pengadaan/${id}`);
  };

  return (
    <>
      <div className="space-y-8">
        {/* SECTION 1: LIST AKTUALISASI (SVC) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-lg font-medium">Daftar Form Aktualisasi (SVC)</p>
            {actualizations.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
                {actualizations.length}
              </span>
            )}
          </div>
          <div className="rounded-lg border bg-card overflow-hidden">
            {loadingActual ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : actualizations.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Tidak ada form aktualisasi yang menunggu pengadaan
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nomor SVC</TableHead>
                    <TableHead>Pelapor</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Deskripsi Kerusakan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actualizations.map((a) => (
                    <TableRow key={a.actualization_id}>
                      <TableCell className="font-medium">
                        {a.form_number}
                      </TableCell>
                      <TableCell>{a.user_name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(a.form_date)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                        {a.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setSelectedActualization(a)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Detail
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleOpenCreatePR(a)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Buat PR
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* SECTION 2: DAFTAR PENGAADAAN (SEMUA STATUS) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-lg font-medium">Daftar Pengadaan</p>
            {allProcurements.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
                {allProcurements.length}
              </span>
            )}
          </div>
          <div className="rounded-lg border bg-card">
            {loading ? (
              <ProcurementTableSkeleton />
            ) : error ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                {error}
              </div>
            ) : allProcurements.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                <Package className="h-8 w-8 text-muted-foreground/50" />
                <p>Belum ada PR dibuat.</p>
              </div>
            ) : (
              // 🌟 HAPUS PROPS onApproVE DARI SINI
              <ProcurementTable
                procurements={allProcurements}
                onView={handleViewProcurement}
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal untuk Pengadaan */}
      {selectedProcurement && (
        <UpdateProcurementModal
          procurement={selectedProcurement}
          onUpdate={handleUpdate}
          onClose={() => setSelectedProcurement(null)}
        />
      )}

      {/* MODAL CREATE PR (Menerima data dari SVC yang dipilih) */}
      <CreateProcurementModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreatePRFromSVC}
        actualizationId={selectedActualForPR?.actualization_id}
        endUser={selectedActualForPR?.user_name}
      />

      {/* MODAL DETAIL AKTUALISASI (SVC) - CLEAN DESIGN */}
      <Dialog
        open={!!selectedActualization}
        onOpenChange={() => setSelectedActualization(null)}
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detail Form Aktualisasi
            </DialogTitle>
          </DialogHeader>

          {selectedActualization && (
            <div className="space-y-4 py-2 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/30 border">
                <div>
                  <p className="text-xs text-muted-foreground">Nomor SVC</p>
                  <p className="font-semibold">
                    {selectedActualization.form_number}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pelapor</p>
                  <p className="font-semibold flex items-center gap-1">
                    <User className="h-3 w-3" />{" "}
                    {selectedActualization.user_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tanggal Form</p>
                  <p className="font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3" />{" "}
                    {formatDate(selectedActualization.form_date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Durasi Penanganan
                  </p>
                  <p className="font-semibold">
                    {selectedActualization.duration_minutes} Menit
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Deskripsi Kerusakan
                </p>
                <div className="border p-3 rounded-md text-xs">
                  {selectedActualization.description || "-"}
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Tindakan yang Dilakukan (Issue)
                </p>
                <div className="border p-3 rounded-md text-xs">
                  {selectedActualization.issue || "-"}
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Rekomendasi
                </p>
                <div className="border p-3 rounded-md text-xs">
                  {selectedActualization.recommendation || "-"}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedActualization(null)}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProcurementPage;
