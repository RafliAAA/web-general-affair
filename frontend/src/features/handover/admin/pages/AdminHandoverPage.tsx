import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Plus, Search, Eye, RotateCcw, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import HandoverStatusBadge from "../components/HandoverStatusBadge";
import HandoverFormDialog from "../components/HandoverFormDialog";
import ReturnHandoverDialog from "../components/ReturnHandoverDialog";
import {
  useAdminHandovers,
  useCreateHandover,
  useReturnHandover,
  useDeleteHandover,
} from "../hooks/useAdminHandover";
import type {
  CreateHandoverPayload,
  ReturnHandoverPayload,
} from "@/types/handover";

const AdminHandoverPage = () => {
  const navigate = useNavigate();
  const { handovers, isLoading, fetchHandovers } = useAdminHandovers();
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [returnId, setReturnId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { isSubmitting: isCreating, createHandover } =
    useCreateHandover(fetchHandovers);
  const { isSubmitting: isReturning, returnHandover } =
    useReturnHandover(fetchHandovers);
  const { isDeleting, deleteHandover } = useDeleteHandover(fetchHandovers);

  useEffect(() => {
    fetchHandovers();
  }, [fetchHandovers]);

  const filtered = handovers.filter((h) => {
    const q = search.toLowerCase();
    return (
      h.entity.toLowerCase().includes(q) ||
      h.directorate.toLowerCase().includes(q) ||
      h.receiver.profile.name.toLowerCase().includes(q) ||
      h.status.toLowerCase().includes(q)
    );
  });

  const fmt = (date: string) =>
    format(new Date(date), "dd MMM yyyy", { locale: id });

  const handleCreate = async (payload: CreateHandoverPayload) => {
    await createHandover(payload);
    setOpenCreate(false);
  };

  const handleReturn = async (id: string, payload: ReturnHandoverPayload) => {
    await returnHandover(id, payload);
    setReturnId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteHandover(deleteId);
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Manajemen Handover">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Manajemen Handover">
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Cari penerima, entity, direktorat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button className="ml-auto" onClick={() => setOpenCreate(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Buat handover
          </Button>
        </div>

        {/* Tabel */}
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Penerima</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Direktorat</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jumlah aset</TableHead>
                <TableHead>Status</TableHead>
                <TableHead >Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-12"
                  >
                    {search
                      ? "Tidak ada hasil pencarian"
                      : "Belum ada data handover"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((h) => (
                  <TableRow key={h.handover_id}>
                    <TableCell className="font-medium">
                      {h.receiver.profile.name}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{h.entity}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-muted-foreground">
                        {h.directorate}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {fmt(h.handover_date)}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{h.items.length}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        item
                      </span>
                    </TableCell>
                    <TableCell>
                      <HandoverStatusBadge status={h.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/serah-terima/${h.handover_id}`)
                              }
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Detail
                            </DropdownMenuItem>
                            {h.status === "Aktif" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setReturnId(h.handover_id)}
                                  className="text-blue-600 focus:text-blue-600"
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Kembalikan
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteId(h.handover_id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modals & Sheets */}
      <HandoverFormDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
        isSubmitting={isCreating}
      />
      <ReturnHandoverDialog
        open={!!returnId}
        handoverId={returnId}
        onClose={() => setReturnId(null)}
        onSubmit={handleReturn}
        isSubmitting={isReturning}
      />

      {/* Konfirmasi Hapus */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus handover?</AlertDialogTitle>
            <AlertDialogDescription>
              Data handover ini akan dihapus permanen dan tidak bisa
              dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminHandoverPage;
