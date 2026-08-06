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
import { useEntity } from "../hooks/useEntity";
import EntityFormModal from "../components/EntityFormModal";
import type { Entity } from "../services/entityService";

const EntityPage = () => {
  const {
    entities,
    loading,
    handleCreateEntity,
    handleUpdateEntity,
    handleDeleteEntity,
  } = useEntity();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Entity | null>(null);

  const openCreate = () => {
    setEditingData(null);
    setModalOpen(true);
  };
  const openEdit = (data: Entity) => {
    setEditingData(data);
    setModalOpen(true);
  };

  const onSubmit = async (data: { entity_name: string }) => {
    if (editingData) await handleUpdateEntity(editingData.entity_id, data);
    else await handleCreateEntity(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Master Entity (Perusahaan)</h1>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1.5" /> Tambah Entity
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Entity</TableHead>
              <TableHead>Jumlah Direktorat</TableHead>
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
            ) : entities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  Belum ada entity.
                </TableCell>
              </TableRow>
            ) : (
              entities.map((ent) => (
                <TableRow key={ent.entity_id}>
                  <TableCell className="font-medium">
                    {ent.entity_name}
                  </TableCell>
                  <TableCell>
                    {ent.directorates?.length || 0} direktorat
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(ent)}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit Entity
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          onClick={() => {
                            if (confirm("Hapus entity ini?"))
                              handleDeleteEntity(ent.entity_id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Hapus Entity
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

      <EntityFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onSubmit}
        initialData={editingData}
      />
    </div>
  );
};

export default EntityPage;
