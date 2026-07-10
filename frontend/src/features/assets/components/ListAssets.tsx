import { EyeIcon, MoreHorizontal, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Asset } from "../../../types/inventory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateAssetModal from "./CreateAssetModal";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { AssetMeta } from "../hooks/useAssets";

interface Props {
  dataAssets: Asset[];
  meta: AssetMeta | null;
  search: string;
  page: number;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  onCreate: (data: Asset) => void;
  onExportPdf: () => void;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
}

const ListAssets = ({
  dataAssets,
  meta,
  search,
  page,
  statusFilter,
  onStatusChange,
  onCreate,
  onExportPdf,
  onSearchChange,
  onPageChange,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between  flex-wrap">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari aset..."
            className="pl-9"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter || "Semua"}
              onValueChange={(value) =>
                onStatusChange(value === "Semua" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Semua">Semua Status</SelectItem>
                <SelectItem value="Tersedia">Tersedia</SelectItem>
                <SelectItem value="Dipinjam">Dipinjam</SelectItem>
                <SelectItem value="Diperbaiki">Diperbaiki</SelectItem>
                <SelectItem value="Diserahkan">Diserahkan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={onExportPdf}>
            Export PDF
          </Button>

          <CreateAssetModal onCreate={onCreate} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Kode Aset</TableHead>
              <TableHead className="font-medium">Nama Aset</TableHead>
              <TableHead className="font-medium">Kategori</TableHead>
              <TableHead className="font-medium">Kondisi</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataAssets.length > 0 ? (
              dataAssets.map((asset) => (
                <TableRow
                  key={asset.asset_id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/aset-perusahaan/${asset.asset_id}`)}
                >
                  <TableCell className="font-medium">
                    {asset.asset_code}
                  </TableCell>
                  <TableCell className="font-medium">
                    {asset.asset_name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {asset.asset_category?.category_name ?? "—"}
                  </TableCell>
                  <TableCell className="font-medium">
                    <Badge
                      variant={
                        asset.condition === "Baik"
                          ? "success"
                          : asset.condition === "Cukup Baik"
                            ? "secondary"
                            : asset.condition === "Rusak"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {asset.condition}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium w-25">
                    <Badge
                      variant={
                        asset.status === "Tersedia"
                          ? "success"
                          : asset.status === "Dipinjam"
                            ? "info"
                            : asset.status === "Diserahkan"
                              ? "secondary"
                              : asset.status === "Diperbaiki"
                                ? "warning"
                                : asset.status === "Dihapus"
                                  ? "destructive"
                                  : "outline"
                      }
                    >
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="text-center w-25"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/aset-perusahaan/${asset.asset_id}`)
                          }
                        >
                          <EyeIcon className="h-4 w-4 mr-2" /> Detail
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  Tidak ada aset ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {dataAssets.length} dari {meta.total} aset
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
            >
              Sebelumnya
            </Button>
            <span className="text-sm px-2">
              {page} / {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === meta.totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListAssets;
