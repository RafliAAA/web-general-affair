import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories } from "../hooks/useCategories";
import CategoryTable from "../components/CategoryTable";
import CategoryFormModal from "../components/CategoryFormModal";
import type { AssetCategory } from "../services/categoryService";

const CategoryPage = () => {
  const { categories, loading, handleCreate, handleUpdate, handleDelete } =
    useCategories();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AssetCategory | null>(
    null,
  );

  const filtered = categories.filter(
    (c) =>
      c.category_name.toLowerCase().includes(search.toLowerCase()) ||
      c.category_code.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreateModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (cat: AssetCategory) => {
    setEditingCategory(cat);
    setModalOpen(true);
  };

  const handleSubmit = async (data: {
    category_name: string;
    category_code: string;
  }) => {
    if (editingCategory) {
      await handleUpdate(editingCategory.asset_category_id, data);
    } else {
      await handleCreate(data);
    }
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      handleDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari kategori..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button size="sm" onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-1.5" />
          Tambah Kategori
        </Button>
      </div>

      {/* Tabel Kategori */}
      <CategoryTable
        categories={filtered}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDeleteClick}
      />

      {/* Modal Form */}
      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingCategory}
      />
    </div>
  );
};

export default CategoryPage;
