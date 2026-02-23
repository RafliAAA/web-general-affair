import DashboardLayout from "@/components/layout/DashboardLayout";
import ListAssets from "./components/ListAssets";
import { useAssets } from "./hooks/useAssets";
import ListAssetSkeleton from "./components/ListAssetSkeleton";

const Assets = () => {
  const { assets, loading, handleCreate, handleUpdate, handleDelete } = useAssets();

  return (
    <DashboardLayout title="Aset Perusahaan">
      {loading ? <ListAssetSkeleton/> : <ListAssets dataAssets={assets} onCreate={handleCreate} onUpdate={handleUpdate} onDelete={handleDelete} />}
    </DashboardLayout>
  );
};


export default Assets;
