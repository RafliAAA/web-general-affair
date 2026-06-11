import DashboardLayout from "@/components/layout/DashboardLayout";
import ListAssets from "../components/ListAssets";
import { useAssets } from "../hooks/useAssets";
import ListAssetSkeleton from "../components/ListAssetSkeleton";

const Assets = () => {
  const { assets, loading, handleCreate } =
    useAssets();

  return (
    <DashboardLayout title="Aset Perusahaan">
      {loading ? (
        <ListAssetSkeleton />
      ) : (
        <ListAssets
          dataAssets={assets}
          onCreate={handleCreate}
        />
      )}
    </DashboardLayout>
  );
};

export default Assets;
