import DashboardLayout from "@/components/layout/DashboardLayout";
import ListAssets from "../components/ListAssets";
import { useAssets } from "../hooks/useAssets";
import ListAssetSkeleton from "../components/ListAssetSkeleton";
import AssetsPdf from "../components/AssetsPdf";

import { pdf } from "@react-pdf/renderer";

const Assets = () => {
  const { assets, loading, handleCreate } = useAssets();

  const handleExportPdf = async () => {
    const blob = await pdf(<AssetsPdf assets={assets} />).toBlob();

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "Daftar-Aset.pdf";

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout title="Aset Perusahaan">
      {loading ? (
        <ListAssetSkeleton />
      ) : (
        <ListAssets
          dataAssets={assets}
          onCreate={handleCreate}
          onExportPdf={handleExportPdf}
        />
      )}
    </DashboardLayout>
  );
};

export default Assets;
