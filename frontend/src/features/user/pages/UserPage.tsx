import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUsers, useCreateUser } from "../hooks/useUser";
import {
  userService,
  type CreateUserPayload,
  type UpdateUserPayload,
  type User,
} from "../services/userService";
import { toast } from "sonner";

// Import Komponen yang baru dibuat
import UserSummaryCards from "../components/UserSummaryCards";
import UserTable from "../components/UserTable";
import CreateUserModal from "../components/CreateUserModal";
import UpdateUserModal from "../components/UpdateUserModal";
import DeleteUserDialog from "../components/DeleteUserDialog";

const UserPage = () => {
  const { users, isLoading, fetchUsers } = useUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua");

  // State untuk Modal Create
  const [formOpen, setFormOpen] = useState(false);
  const { isSubmitting, createUser } = useCreateUser(fetchUsers);

  // State untuk Modal Update & Delete
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users
    .filter((u) => roleFilter === "Semua" || u.role === roleFilter)
    .filter(
      (u) =>
        u.profile?.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );

  const handleCreate = async (payload: CreateUserPayload) => {
    await createUser(payload);
    setFormOpen(false);
  };

  const handleUpdate = async (id: string, payload: UpdateUserPayload) => {
    setIsUpdating(true);
    try {
      await userService.update(id, payload);
      toast.success("User berhasil diperbarui!");
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memperbarui user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    try {
      await userService.delete(deletingUser.user_id);
      toast.success("User berhasil dihapus!");
      setDeletingUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Gagal menghapus user. Mungkin user ini memiliki riwayat transaksi.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau email..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {["Semua", "USER", "ADMIN", "IT"].map((r) => (
              <Button
                key={r}
                size="sm"
                variant={roleFilter === r ? "default" : "outline"}
                onClick={() => setRoleFilter(r)}
              >
                {r === "Semua"
                  ? "Semua"
                  : r === "USER"
                    ? "Karyawan"
                    : r === "ADMIN"
                      ? "GA"
                      : "IT"}
              </Button>
            ))}
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" />
              Tambah user
            </Button>
          </div>
        </div>

        {/* Summary */}
        {!isLoading && <UserSummaryCards users={users} />}

        {/* Table */}
        <UserTable
          users={filtered}
          isLoading={isLoading}
          onEdit={(user) => setEditingUser(user)}
          onDelete={(user) => setDeletingUser(user)}
        />
      </div>

      {/* Modals */}
      <CreateUserModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />

      <UpdateUserModal
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={handleUpdate}
        initialData={editingUser}
        isSubmitting={isUpdating}
      />

      <DeleteUserDialog
        open={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDelete}
        user={deletingUser}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default UserPage;
