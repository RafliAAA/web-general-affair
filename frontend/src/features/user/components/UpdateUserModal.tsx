import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { User, UpdateUserPayload } from "../services/userService";
import { useEntity } from "@/features/entity/hooks/useEntity";
import { useDirectorate } from "@/features/directorate/hooks/useDirectorate";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string, payload: UpdateUserPayload) => Promise<void>;
  initialData: User | null;
  isSubmitting: boolean;
}

const UpdateUserModal = ({ open, onClose, onSubmit, initialData, isSubmitting }: Props) => {
  const [form, setForm] = useState<UpdateUserPayload>({
    name: "",
    email: "",
    role: "USER",
    entity_id: "",
    directorate_id: "",
  });

  const { entities } = useEntity();
  const { directorates, fetchDirectorates } = useDirectorate();

  useEffect(() => {
    if (open && initialData) {
      setForm({
        name: initialData.profile?.name || "",
        email: initialData.email,
        role: initialData.role,
        entity_id: initialData.profile?.entity_id || "",
        directorate_id: initialData.profile?.directorate_id || "",
      });
      
      if (initialData.profile?.entity_id) {
        fetchDirectorates(initialData.profile.entity_id);
      }
    }
  }, [open, initialData, fetchDirectorates]);

  const handleSubmit = async () => {
    if (!initialData) return;
    await onSubmit(initialData.user_id, form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Nama Lengkap</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          
          <div className="space-y-2">
            <Label>Entity (Perusahaan)</Label>
            <Select
              value={form.entity_id}
              onValueChange={(val) => {
                setForm(prev => ({ ...prev, entity_id: val, directorate_id: "" }));
                fetchDirectorates(val); // Fetch directorate baru saat entity diganti
              }}
            >
              <SelectTrigger><SelectValue placeholder="Pilih Entity" /></SelectTrigger>
              <SelectContent>
                {entities.map((ent) => (
                  <SelectItem key={ent.entity_id} value={ent.entity_id}>{ent.entity_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Direktorat</Label>
            <Select
              value={form.directorate_id}
              onValueChange={(val) => setForm({ ...form, directorate_id: val })}
              disabled={!form.entity_id}
            >
              <SelectTrigger><SelectValue placeholder="Pilih Direktorat" /></SelectTrigger>
              <SelectContent>
                {directorates.map((dir) => (
                  <SelectItem key={dir.directorate_id} value={dir.directorate_id}>{dir.directorate_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(val) => setForm({ ...form, role: val as any })}>
              <SelectTrigger><SelectValue placeholder="Pilih Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">Karyawan</SelectItem>
                <SelectItem value="ADMIN">General Affair</SelectItem>
                <SelectItem value="IT">Tim IT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserModal;