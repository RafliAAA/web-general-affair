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
import CreateAssetModal from "./CreateAssetModal";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Props {
  dataAssets: Asset[];
  onCreate: (data: Asset) => void;
}

const ListAssets = ({ dataAssets, onCreate }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-row items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari aset..."
            className="pl-9 border border-secondary"
          />
        </div>

        {/* Add Button */}
        <CreateAssetModal onCreate={onCreate} />
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table className="min-w-full text-sm ">
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium ">Nama Aset</TableHead>
              <TableHead className="font-medium ">Kategori</TableHead>
              <TableHead className="font-medium ">Kode Aset</TableHead>
              <TableHead className="font-medium ">Kondisi</TableHead>
              <TableHead className="font-medium ">Status</TableHead>
              <TableHead className="font-medium "></TableHead>
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
                    {asset.asset_name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {asset.asset_type}
                  </TableCell>
                  <TableCell className="font-medium">
                    {asset.serial_number}
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
                            ? "secondary"
                            : asset.status === "maintenance"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center w-25">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
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
    </div>
  );
};

export default ListAssets;
