import { useState } from "react";
import { Plus, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDirectorate } from "../hooks/useDirectorate";
import { useEntity } from "../../entity/hooks/useEntity";
import DirectorateFormModal from "../components/DirectorateFormModal";
import type { Directorate } from "../services/directorateService";

const DirectoratePage = () => {
  const { entities } = useEntity();
  const {
    directorates,
    loading,
    handleCreateDirectorate,
    handleUpdateDirectorate,
    handleDeleteDirectorate,
  } = useDirectorate();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Directorate | null>(null);

  const openCreate = () => {
    setEditingData(null);
    setModalOpen(true);
  };
  const openEdit = (data: Directorate) => {
    setEditingData(data);
    setModalOpen(true);
  };

  const onSubmit = async (data: {
    directorate_name: string;
    entity_id: string;
  }) => {
    if (editingData)
      await handleUpdateDirectorate(editingData.directorate_id, data);
    else await handleCreateDirectorate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Master Direktorat</h1>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1.5" /> Tambah Direktorat
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Direktorat</TableHead>
              <TableHead>Entity (Perusahaan)</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : directorates.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  Belum ada direktorat.
                </TableCell>
              </TableRow>
            ) : (
              directorates.map((dir) => (
                <TableRow key={dir.directorate_id}>
                  <TableCell className="font-medium">
                    {dir.directorate_name}
                  </TableCell>
                  <TableCell>{dir.entity?.entity_name ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(dir)}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit Direktorat
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          onClick={() => {
                            if (confirm("Hapus direktorat ini?"))
                              handleDeleteDirectorate(dir.directorate_id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Hapus Direktorat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DirectorateFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onSubmit}
        initialData={editingData}
        entities={entities}
      />
    </div>
  );
};

export default DirectoratePage;
