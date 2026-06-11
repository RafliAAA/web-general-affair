import { useState } from "react";
import  DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Pencil, Trash2, Search, FileText, BookOpen } from "lucide-react";
import {toast} from "sonner"
import type { SOP } from "@/types/sop";
import { categories, emptySOP, initialSOPs } from "@/data/mockData";




export default function SOP() {
  const [sops, setSOPs] = useState<SOP[]>(initialSOPs);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingSOP, setEditingSOP] = useState<
    typeof emptySOP & { id?: string }
  >(emptySOP);

  const filtered = sops.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "all" || s.category === filterCategory;
    return matchSearch && matchCat;
  });

  const openCreate = () => {
    setEditingSOP({ ...emptySOP, steps: [{ order: 1, description: "" }] });
    setDialogOpen(true);
  };

  const openEdit = (sop: SOP) => {
    setEditingSOP({
      id: sop.id,
      title: sop.title,
      category: sop.category,
      description: sop.description,
      steps: [...sop.steps],
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingSOP.title || !editingSOP.category || !editingSOP.description) {
     toast.error("Semua field wajib diisi.")
      return;
    }
    const now = new Date().toISOString().slice(0, 10);
    if (editingSOP.id) {
      setSOPs((prev) =>
        prev.map((s) =>
          s.id === editingSOP.id
            ? {
                ...s,
                title: editingSOP.title,
                category: editingSOP.category,
                description: editingSOP.description,
                steps: editingSOP.steps,
                updatedAt: now,
              }
            : s,
        ),
      );
      toast.success("SOP berhasil diperbarui.")
    } else {
      const newSOP: SOP = {
        id: Date.now().toString(),
        title: editingSOP.title,
        category: editingSOP.category,
        description: editingSOP.description,
        steps: editingSOP.steps,
        createdAt: now,
        updatedAt: now,
      };
      setSOPs((prev) => [...prev, newSOP]);
      toast.success("SOP baru berhasil ditambahkan.")
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setSOPs((prev) => prev.filter((s) => s.id !== deleteId));
    toast.success("SOP berhasil dihapus.")
      setDeleteId(null);
    }
  };

  const addStep = () => {
    setEditingSOP((prev) => ({
      ...prev,
      steps: [...prev.steps, { order: prev.steps.length + 1, description: "" }],
    }));
  };

  const removeStep = (idx: number) => {
    setEditingSOP((prev) => ({
      ...prev,
      steps: prev.steps
        .filter((_, i) => i !== idx)
        .map((s, i) => ({ ...s, order: i + 1 })),
    }));
  };

  const updateStep = (idx: number, desc: string) => {
    setEditingSOP((prev) => ({
      ...prev,
      steps: prev.steps.map((s, i) =>
        i === idx ? { ...s, description: desc } : s,
      ),
    }));
  };

  const categoryColor = (cat: string) => {
    const map: Record<string, string> = {
      Aset: "bg-primary/10 text-primary",
      Kendaraan: "bg-accent text-accent-foreground",
      Ruangan: "bg-secondary text-secondary-foreground",
      Umum: "bg-muted text-muted-foreground",
      Keamanan: "bg-destructive/10 text-destructive",
    };
    return map[cat] || "bg-muted text-muted-foreground";
  };

  return (
    <DashboardLayout title="SOP General Affair">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground"></p>
          </div>

          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah SOP
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari SOP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* SOP List */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center ">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Tidak ada SOP ditemukan.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 ">
            {filtered.map((sop) => (
              <Card key={sop.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base">{sop.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {sop.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className={categoryColor(sop.category)}
                      >
                        {sop.category}
                      </Badge>

                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(sop)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(sop.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Accordion type="single" collapsible>
                    <AccordionItem
                      value="steps"
                      className=""
                    >
                      <AccordionTrigger className="py-2 text-sm text-muted-foreground hover:no-underline">
                        Lihat {sop.steps.length} Langkah
                      </AccordionTrigger>
                      <AccordionContent>
                        <ol className="space-y-2 mt-2">
                          {sop.steps.map((step) => (
                            <li key={step.order} className="flex gap-3 text-sm">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                {step.order}
                              </span>
                              <span className="pt-0.5">{step.description}</span>
                            </li>
                          ))}
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Dibuat: {sop.createdAt}</span>
                    <span>Diperbarui: {sop.updatedAt}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSOP.id ? "Edit SOP" : "Tambah SOP Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingSOP.id
                ? "Perbarui informasi SOP."
                : "Isi informasi untuk SOP baru."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul SOP</Label>
              <Input
                value={editingSOP.title}
                onChange={(e) =>
                  setEditingSOP((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Masukkan judul SOP"
              />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select
                value={editingSOP.category}
                onValueChange={(v) =>
                  setEditingSOP((p) => ({ ...p, category: v }))
                }
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
                onChange={(e) =>
                  setEditingSOP((p) => ({ ...p, description: e.target.value }))
                }
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
                  onClick={addStep}
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
                    onChange={(e) => updateStep(idx, e.target.value)}
                    placeholder={`Langkah ${step.order}`}
                    className="flex-1"
                  />
                  {editingSOP.steps.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 text-destructive"
                      onClick={() => removeStep(idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave}>
              {editingSOP.id ? "Simpan Perubahan" : "Tambah SOP"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus SOP?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. SOP akan dihapus secara
              permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
