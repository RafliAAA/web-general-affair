import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const DisposalTableSkeleton = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Nomor memo</TableHead>
        <TableHead>Subjek</TableHead>
        <TableHead>Tanggal memo</TableHead>
        <TableHead>Deskripsi</TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 5 }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default DisposalTableSkeleton;
