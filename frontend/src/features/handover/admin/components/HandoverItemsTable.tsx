import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { HandoverItem } from "@/types/handover";

interface HandoverItemsTableProps {
  items: HandoverItem[];
}

const HandoverItemsTable = ({ items }: HandoverItemsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-10">#</TableHead>
            <TableHead>Kode Aset</TableHead>
            <TableHead>Nama Aset</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Keterangan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground py-6"
              >
                Tidak ada item
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, idx) => (
              <TableRow key={item.handover_item_id}>
                <TableCell className="text-muted-foreground">
                  {idx + 1}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {item.asset.asset_code}
                </TableCell>
                <TableCell className="font-medium">
                  {item.asset.asset_name}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {item.asset.asset_type}
                </TableCell>
                <TableCell className="text-sm">{item.notes || "-"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default HandoverItemsTable;
