import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateUserPayload } from "../services/userService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateUserPayload) => Promise<void>;
  isSubmitting: boolean;
}

const ROLE_OPTIONS: { value: CreateUserPayload["role"]; label: string }[] = [
  { value: "USER", label: "Karyawan" },
  { value: "ADMIN", label: "General Affair" },
  { value: "IT", label: "Tim IT" },
];

const initialForm: CreateUserPayload = {
  name: "",
  email: "",
  password: "",
  role: "USER",
};

const CreateUserModal = ({ open, onClose, onSubmit, isSubmitting }: Props) => {
  const [form, setForm] = useState<CreateUserPayload>(initialForm);

  const isValid = form.name && form.email && form.password && form.role;

  const handleChange = (field: keyof CreateUserPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    await onSubmit(form);
    setForm(initialForm);
    onClose();
  };

  const handleClose = () => {
    setForm(initialForm);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Tambah user baru
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">
              Nama lengkap
            </Label>
            <Input
              placeholder="contoh: Rafli Alamsyah"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Email</Label>
            <Input
              type="email"
              placeholder="contoh: rafli@syaamilgroup.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Password</Label>
            <Input
              type="password"
              placeholder="Minimal 8 karakter"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Role</Label>
            <Select
              value={form.role}
              onValueChange={(val) => handleChange("role", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            size="sm"
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserModal;
