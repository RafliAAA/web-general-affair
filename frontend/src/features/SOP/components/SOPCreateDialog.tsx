import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { categories } from "@/data/mockData";
import type { EditingSOP } from "../hooks/useSOPs";

interface SOPCreateDialogProps {
  open: boolean;
  editingSOP: EditingSOP;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onFieldChange: (field: keyof EditingSOP, value: string) => void;
  onAddStep: () => void;
  onRemoveStep: (idx: number) => void;
  onUpdateStep: (idx: number, desc: string) => void;
}

export default function SOPCreateDialog({
  open,
  editingSOP,
  onOpenChange,
  onSave,
  onFieldChange,
  onAddStep,
  onRemoveStep,
  onUpdateStep,
}: SOPCreateDialogProps) {
  const isEdit = !!editingSOP.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit SOP" : "Tambah SOP Baru"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Perbarui informasi SOP." : "Isi informasi untuk SOP baru."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Judul SOP</Label>
            <Input
              value={editingSOP.title}
              onChange={(e) => onFieldChange("title", e.target.value)}
              placeholder="Masukkan judul SOP"
            />
          </div>

          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select
              value={editingSOP.category}
              onValueChange={(v) => onFieldChange("category", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea
              value={editingSOP.description}
              onChange={(e) => onFieldChange("description", e.target.value)}
              placeholder="Masukkan deskripsi SOP"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Langkah-langkah</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onAddStep}
                className="gap-1"
              >
                <Plus className="h-3 w-3" /> Tambah Langkah
              </Button>
            </div>
            {editingSOP.steps.map((step, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium mt-1">
                  {step.order}
                </span>
                <Input
                  value={step.description}
                  onChange={(e) => onUpdateStep(idx, e.target.value)}
                  placeholder={`Langkah ${step.order}`}
                  className="flex-1"
                />
                {editingSOP.steps.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-destructive"
                    onClick={() => onRemoveStep(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={onSave}>
            {isEdit ? "Simpan Perubahan" : "Tambah SOP"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}