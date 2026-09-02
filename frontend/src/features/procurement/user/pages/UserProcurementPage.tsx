import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Package, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useUserProcurement } from "../hooks/useUserProcurement";
import UserProcurementModal from "../components/UserProcurementModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const UserProcurementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const currentUserName = user?.profile?.name || "";

  const { procurements, loading, isSubmitting, handleCreate } =
    useUserProcurement(currentUserName);
  const [modalOpen, setModalOpen] = useState(false);

  // 🌟 Dummy handler untuk Edit & Hapus
  const handleEdit = (id: string) => {
    toast.info("Fitur edit akan datang!");
  };

  const handleDelete = (id: string) => {
    toast.info("Fitur hapus akan datang!");
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">Pengajuan Pengadaan Saya</h1>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Ajukan PR Baru
          </Button>
        </div>

        <div className="rounded-lg border bg-card">
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : procurements.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
              <Package className="h-8 w-8 text-muted-foreground/50" />
              <p>Anda belum pernah mengajukan pengadaan.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor PR</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {procurements.map((p) => (
                  <TableRow
                    key={p.procurement_id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() =>
                      navigate(`/pengajuan-aset/${p.procurement_id}`)
                    }
                  >
                    <TableCell className="font-medium">{p.pr_number}</TableCell>
                    <TableCell className="text-sm">
                      {formatDate(p.pr_date)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(p.due_date)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {/* 🌟 MENU TITIK TIGA */}
                      <div onClick={(e) => e.stopPropagation()}>
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
                              onClick={() =>
                                navigate(`/pengajuan-aset/${p.procurement_id}`)
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(p.procurement_id)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDelete(p.procurement_id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <UserProcurementModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
        endUser={currentUserName}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default UserProcurementPage;
