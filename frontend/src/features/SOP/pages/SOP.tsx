import DashboardLayout from "@/components/layout/DashboardLayout";
import SOPHeader from "../components/SOPHeader";
import SOPFilters from "../components/SOPFilters";
import SOPList from "../components/SOPList";
import SOPCreateDialog from "../components/SOPCreateDialog";
import SOPDeleteDialog from "../components/SOPDeleteDialog";
import { useSOPs } from "../hooks/useSOPs";

export default function SOP() {
  const {
    filtered,
    search,
    filterCategory,
    dialogOpen,
    deleteId,
    editingSOP,
    setSearch,
    setFilterCategory,
    setDialogOpen,
    setDeleteId,
    setEditingSOP,
    openCreate,
    openEdit,
    handleSave,
    handleDelete,
    addStep,
    removeStep,
    updateStep,
  } = useSOPs();

  return (
    <DashboardLayout title="SOP General Affair">
      <div className="space-y-6">
        <SOPHeader onAdd={openCreate} />

        <SOPFilters
          search={search}
          filterCategory={filterCategory}
          onSearchChange={setSearch}
          onCategoryChange={setFilterCategory}
        />

        <SOPList
          sops={filtered}
          onEdit={openEdit}
          onDelete={setDeleteId}
        />
      </div>

      <SOPCreateDialog
        open={dialogOpen}
        editingSOP={editingSOP}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        onFieldChange={(field, value) =>
          setEditingSOP((prev) => ({ ...prev, [field]: value }))
        }
        onAddStep={addStep}
        onRemoveStep={removeStep}
        onUpdateStep={updateStep}
      />

      <SOPDeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}