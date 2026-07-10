import { useEffect, useState } from "react";
import { Search, Plus, UserCircle } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreateUserModal from "../components/CreateUserModal";
import { useUsers, useCreateUser } from "../hooks/useUser";
import type { CreateUserPayload } from "../services/userService";

const ROLE_LABEL: Record<string, string> = {
  USER: "Karyawan",
  ADMIN: "General Affair",
  IT: "Tim IT",
};

const ROLE_VARIANT: Record<string, "warning" | "success" | "default"> = {
  USER: "warning",
  ADMIN: "default",
  IT: "success",
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const UserPage = () => {
  const { users, isLoading, fetchUsers } = useUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua");
  const [formOpen, setFormOpen] = useState(false);

  const { isSubmitting, createUser } = useCreateUser(fetchUsers);

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

  return (
    <DashboardLayout title="Manajemen User">
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
                {r === "Semua" ? "Semua" : ROLE_LABEL[r]}
              </Button>
            ))}
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" />
              Tambah user
            </Button>
          </div>
        </div>

        {/* Summary */}
        {!isLoading && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { role: "USER", label: "Karyawan" },
              { role: "ADMIN", label: "General Affair" },
              { role: "IT", label: "Tim IT" },
            ].map(({ role, label }) => (
              <div
                key={role}
                className="rounded-lg border bg-card p-4 flex items-center gap-3"
              >
                <div className="p-2 rounded-md bg-muted">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {users.filter((u) => u.role === role).length}
                  </p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        <div className="rounded-lg border bg-card">
          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  {["Nama", "Email", "Role", "Dibuat"].map((h) => (
                    <TableHead key={h}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
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
              {search ? "Tidak ada user ditemukan" : "Belum ada data user"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Dibuat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">
                      {user.profile?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={ROLE_VARIANT[user.role]}>
                        {ROLE_LABEL[user.role] ?? user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(user.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <CreateUserModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />
    </DashboardLayout>
  );
};

export default UserPage;
