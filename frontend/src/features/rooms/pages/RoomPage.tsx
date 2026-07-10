import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoomFormModal from "../components/RoomFormModal";
import {
  useRooms,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
} from "../hooks/useRooms";
import type { Room, CreateRoomPayload } from "../services/roomsService";

const RoomPage = () => {
  const navigate = useNavigate();
  const { rooms, isLoading, fetchRooms } = useRooms();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { isSubmitting: isCreating, createRoom } = useCreateRoom(fetchRooms);
  const { isSubmitting: isUpdating, updateRoom } = useUpdateRoom(fetchRooms);
  const { isDeleting, deleteRoom } = useDeleteRoom(fetchRooms);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const filtered = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = async (payload: CreateRoomPayload) => {
    await createRoom(payload);
    setFormOpen(false);
  };

  const handleUpdate = async (payload: CreateRoomPayload) => {
    if (!selectedRoom) return;
    await updateRoom(selectedRoom.room_id, payload);
    setSelectedRoom(null);
    setFormOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteRoom(deleteId);
    setDeleteId(null);
  };

  return (
    <DashboardLayout title="Manajemen Ruangan">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau lokasi ruangan..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            onClick={() => {
              setSelectedRoom(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Tambah ruangan
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  {[
                    "Nama ruangan",
                    "Lokasi",
                    "Kapasitas",
                    "Fasilitas",
                    "Status",
                    "",
                  ].map((h, i) => (
                    <TableHead key={i}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {search
                ? "Tidak ada ruangan ditemukan"
                : "Belum ada data ruangan"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama ruangan</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Kapasitas</TableHead>
                  <TableHead>Fasilitas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((room) => (
                  <TableRow
                    key={room.room_id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/ruangan/${room.room_id}`)}
                  >
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{room.location}</TableCell>
                    <TableCell>{room.capacity} orang</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {room.facilities.length > 0 ? (
                          room.facilities.slice(0, 3).map((f) => (
                            <Badge
                              key={f.facility_id}
                              variant="outline"
                              className="text-xs"
                            >
                              {f.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                        {room.facilities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{room.facilities.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          room.status === "Tersedia" ? "success" : "destructive"
                        }
                      >
                        {room.status}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="text-center w-12"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/ruangan/${room.room_id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setSelectedRoom(room);
                              setFormOpen(true);
                            }}
                          >
                            <SquarePen className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteId(room.room_id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
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

      {/* Create / Edit Modal */}
      <RoomFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedRoom(null);
        }}
        onSubmit={selectedRoom ? handleUpdate : handleCreate}
        isSubmitting={selectedRoom ? isUpdating : isCreating}
        room={selectedRoom}
      />

      {/* Konfirmasi Hapus */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus ruangan?</AlertDialogTitle>
            <AlertDialogDescription>
              Data ruangan ini akan dihapus permanen dan tidak bisa
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

export default RoomPage;
