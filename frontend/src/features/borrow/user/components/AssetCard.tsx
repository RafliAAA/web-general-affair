import { Button } from "@/components/ui/button";
import { categoryIconMap } from "@/lib/utils";
import type { Asset } from "../../../../types/inventory";
import { Package } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface Props {
  asset: Asset;
  onSelect: (asset: Asset) => void;
}

const AssetCard = ({ asset, onSelect }: Props) => {
  const Icon =
    categoryIconMap[
      asset.asset_category?.category_name as keyof typeof categoryIconMap
    ] ?? Package;

  return (
    <div
      className="rounded-lg border bg-card p-4 cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all duration-200 flex flex-col justify-between min-h-35"
      onClick={() => onSelect(asset)}
    >
      {/* Bagian Atas: Nama/Kode (Kiri) & Tersedia (Kanan) */}
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-1">
          <p className="text-sm font-medium leading-tight line-clamp-2">
            {asset.asset_name}
          </p>
          <p className="text-xs text-muted-foreground">({asset.asset_code})</p>
        </div>
        <StatusBadge status={asset.status} />
      </div>

      {/* Bagian Bawah: Kategori (Kiri) & Tombol Pinjam (Kanan) */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon className="h-3 w-3" />
          <span>{asset.asset_category?.category_name || "Umum"}</span>
        </div>

        <Button
          size="sm"
          variant="default"
          className="h-7 px-3 text-xs"
          onClick={(e) => {
            e.stopPropagation(); // Cegah event klik card berjalan 2x
            onSelect(asset);
          }}
        >
          Pinjam
        </Button>
      </div>
    </div>
  );
};

export default AssetCard;
