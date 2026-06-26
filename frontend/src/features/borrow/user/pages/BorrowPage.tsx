import { useState } from "react";
import { Search, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAvailableAssets } from "../hooks/useAvailableAssets";
import AssetCard from "../components/AssetCard";
import AssetCardSkeleton from "../components/AssetCardSkeleton";
import BorrowModal from "../components/BorrowModal";
import type { Asset } from "../../../../types/inventory";

const KATEGORI = ["Semua", "Laptop", "Handphone", "Kamera", "Mobil"];

const BorrowPage = () => {
  const { assets, loading, handleBorrowRequest } = useAvailableAssets();
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filtered = assets.filter((a) => {
    const matchSearch =
      a.asset_name.toLowerCase().includes(search.toLowerCase()) ||
      a.asset_code.toLowerCase().includes(search.toLowerCase());
    const matchKategori = kategori === "Semua" || a.asset_type === kategori;
    return matchSearch && matchKategori;
  });

  const handleConfirm = async (
    borrow_date: string,
    borrow_reason: string,
    expected_return_date: string,
  ) => {
    if (!selectedAsset) return;
    try {
      setSubmitting(true);
      await handleBorrowRequest(
        selectedAsset.asset_id,
        borrow_date,
        borrow_reason,
        expected_return_date,
      );
      setSelectedAsset(null);
    } catch (err) {
      console.error("Failed to submit borrow request", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Peminjaman Aset">
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-baseline">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari aset..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {KATEGORI.map((k) => (
              <Button
                key={k}
                size="sm"
                variant={kategori === k ? "default" : "outline"}
                onClick={() => setKategori(k)}
              >
                {k}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <AssetCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((asset) => (
              <AssetCard
                key={asset.asset_id}
                asset={asset}
                onSelect={setSelectedAsset}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
            <Package className="h-8 w-8" />
            <p className="text-sm">Tidak ada aset tersedia</p>
          </div>
        )}
      </div>

      {/* Borrow Modal */}
      {selectedAsset && (
        <BorrowModal
          asset={selectedAsset}
          onConfirm={handleConfirm}
          onClose={() => setSelectedAsset(null)}
          loading={submitting}
        />
      )}
    </DashboardLayout>
  );
};

export default BorrowPage;
