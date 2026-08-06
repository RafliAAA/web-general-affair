import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMyAssets } from "../hooks/useMyAssets";
// IMPORT KOMPONEN SHARED STATUS BADGE
import { StatusBadge } from "../../../components/shared/StatusBadge";

export default function MyAssetList() {
  const navigate = useNavigate();
  const { assets, loading } = useMyAssets();
  const [search, setSearch] = useState("");

  // Filter aset berdasarkan search bar (client-side)
  const filteredAssets = assets.filter((asset) => {
    return (
      asset.asset_name.toLowerCase().includes(search.toLowerCase()) ||
      asset.asset_code.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Search */}
      <div className="flex items-center justify-between flex-wrap">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari aset saya..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  Memuat data aset...
                </TableCell>
              </TableRow>
            ) : filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
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
                  {/* GANTI PAKAI STATUS BADGE */}
                  <TableCell className="font-medium">
                    <StatusBadge status={asset.condition} />
                  </TableCell>
                  {/* GANTI PAKAI STATUS BADGE */}
                  <TableCell className="font-medium w-25">
                    <StatusBadge status={asset.status} />
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
                  Belum ada aset yang diserahkan kepada Anda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
