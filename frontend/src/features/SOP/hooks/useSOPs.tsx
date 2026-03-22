import { useState } from "react";
import { toast } from "sonner";
import type { SOP } from "@/types/sop";
import { emptySOP, initialSOPs } from "@/data/mockData";

export type EditingSOP = typeof emptySOP & { id?: string };

export function useSOPs() {
  const [sops, setSOPs] = useState<SOP[]>(initialSOPs);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingSOP, setEditingSOP] = useState<EditingSOP>(emptySOP);

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
      toast.error("Semua field wajib diisi.");
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
      toast.success("SOP berhasil diperbarui.");
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
      toast.success("SOP baru berhasil ditambahkan.");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setSOPs((prev) => prev.filter((s) => s.id !== deleteId));
      toast.success("SOP berhasil dihapus.");
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

  return {
    // state
    filtered,
    search,
    filterCategory,
    dialogOpen,
    deleteId,
    editingSOP,
    // setters
    setSearch,
    setFilterCategory,
    setDialogOpen,
    setDeleteId,
    setEditingSOP,
    // actions
    openCreate,
    openEdit,
    handleSave,
    handleDelete,
    addStep,
    removeStep,
    updateStep,
  };
}