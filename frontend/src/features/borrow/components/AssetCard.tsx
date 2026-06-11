import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categoryIconMap, conditionVariant } from "@/lib/utils";
import type { Asset } from "../../../types/inventory";

interface Props {
  asset: Asset;
  onSelect: (asset: Asset) => void;
}

const AssetCard = ({ asset, onSelect }: Props) => {
  const Icon = categoryIconMap[asset.asset_type as keyof typeof categoryIconMap];

  return (
    <div
      className="rounded-lg border bg-card p-4 space-y-3 hover:border-primary/50 transition-colors cursor-pointer"
      onClick={() => onSelect(asset)}
    >
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-md bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <Badge variant={conditionVariant(asset.condition)} className="text-xs">
          {asset.condition}
        </Badge>
      </div>
      <div>
        <p className="text-sm font-medium leading-tight">{asset.asset_name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{asset.asset_code}</p>
      </div>
      <Button size="sm" variant="outline" className="w-full text-xs">
        Pinjam
      </Button>
    </div>
  );
};

export default AssetCard;