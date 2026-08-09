import { useState, useEffect } from "react";
import { Search, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAvailableAssets } from "../hooks/useAvailableAssets";
import AssetCard from "../components/AssetCard";
import AssetCardSkeleton from "../components/AssetCardSkeleton";
import BorrowModal from "../components/BorrowModal";
import { StatusBadge } from "@/components/shared/StatusBadge"; // Sesuaikan path
import type { Asset } from "../../../../types/inventory";

const KATEGORI = ["Semua", "Elektronik", "Kendaraan"];

// Setting jumlah aset per halaman
const ITEMS_PER_PAGE = 8;

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const BorrowPage = () => {
  const { assets, loading, handleBorrowRequest, myBorrows, loadingBorrows } =
    useAvailableAssets();

  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // STATE UNTUK PAGINATION
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = assets.filter((a) => {
    const matchSearch =
      a.asset_name.toLowerCase().includes(search.toLowerCase()) ||
      a.asset_code.toLowerCase().includes(search.toLowerCase());
    const matchKategori =
      kategori === "Semua" || a.asset_category?.category_name === kategori;
    return matchSearch && matchKategori;
  });

  // Reset ke halaman 1 setiap kali search atau kategori berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search, kategori]);

  // LOGIKA PAGINATION
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentAssets = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleConfirm = async (
    borrow_date: string,
    borrow_reason: string,
    expected_return_date: string,
    recipient_type: "Personal" | "Divisi",
  ) => {
    if (!selectedAsset) return;
    try {
      setSubmitting(true);
      await handleBorrowRequest(
        selectedAsset.asset_id,
        borrow_date,
        borrow_reason,
        expected_return_date,
        recipient_type,
      );
      setSelectedAsset(null);
    } catch (err) {
      console.error("Failed to submit borrow request", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* BAGIAN 1: ASET TERSEDIA (GRID) */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Aset Tersedia</h2>

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

          {/* Grid Aset (Pakai data currentAssets) */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <AssetCardSkeleton key={i} />
              ))}
            </div>
          ) : currentAssets.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentAssets.map((asset) => (
                  <AssetCard
                    key={asset.asset_id}
                    asset={asset}
                    onSelect={setSelectedAsset}
                  />
                ))}
              </div>

              {/* KONTROL PAGINATION */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Menampilkan {currentAssets.length} dari {filtered.length}{" "}
                    aset
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      Sebelumnya
                    </Button>
                    <span className="text-sm font-medium px-2">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Selanjutnya
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
              <Package className="h-8 w-8" />
              <p className="text-sm">Tidak ada aset tersedia</p>
            </div>
          )}
        </div>

        {/* BAGIAN 2: PEMINJAMAN SAYA (TABEL) */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Peminjaman Saya</h2>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Aset</TableHead>
                  <TableHead>Alasan Pinjam</TableHead>
                  <TableHead>Rencana Kembali</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingBorrows ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-8"
                    >
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : myBorrows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-8"
                    >
                      Belum ada riwayat peminjaman.
                    </TableCell>
                  </TableRow>
                ) : (
                  myBorrows.map((b) => (
                    <TableRow key={b.borrow_id}>
                      <TableCell className="font-medium">
                        {b.asset?.asset_name ?? "—"}
                      </TableCell>
                      <TableCell className="max-w-48 truncate text-sm">
                        {b.borrow_reason}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(b.expected_return_date)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={b.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
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
    </>
  );
};

export default BorrowPage;
