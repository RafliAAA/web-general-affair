import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const ProcurementTableSkeleton = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Nomor PR</TableHead>
        <TableHead>End user</TableHead>
        <TableHead>Tanggal PR</TableHead>
        <TableHead>Jatuh tempo</TableHead>
        <TableHead>Keterangan</TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 6 }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default ProcurementTableSkeleton;
