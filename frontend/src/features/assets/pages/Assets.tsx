import ListAssets from "../components/ListAssets";
import { useAssets } from "../hooks/useAssets";
import ListAssetSkeleton from "../components/ListAssetSkeleton";
import AssetsPdf from "../components/AssetsPdf";
import { pdf } from "@react-pdf/renderer";
import { getAssets } from "../services/assetService";

const Assets = () => {
  const {
    assets,
    meta,
    loading,
    page,
    statusFilter,
    setPage,
    search,
    handleSearchChange,
    handleStatusChange,
    handleCreate,
  } = useAssets(10);


const handleExportPdf = async () => {
  // Fetch semua aset tanpa limit untuk export
  const result = await getAssets({ limit: 9999 });
  
  
  const blob = await pdf(<AssetsPdf assets={result.data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Daftar-Aset.pdf";
  link.click();
  URL.revokeObjectURL(url);
};

  return (
    <>
      {loading ? (
        <ListAssetSkeleton />
      ) : (
        <ListAssets
          dataAssets={assets}
          meta={meta}
          search={search}
          page={page}
          statusFilter={statusFilter}
          onCreate={handleCreate}
          onExportPdf={handleExportPdf}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onPageChange={setPage}
        />
      )}
    </>
  );
};

export default Assets;