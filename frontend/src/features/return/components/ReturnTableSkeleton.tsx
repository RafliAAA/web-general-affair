import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const ReturnTableSkeleton = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Nama karyawan</TableHead>
        <TableHead>Nama aset</TableHead>
        <TableHead>Kategori</TableHead>
        <TableHead>Serial number</TableHead>
        <TableHead>Tgl pinjam</TableHead>
        <TableHead>Tgl rencana kembali</TableHead>
        <TableHead>Aksi</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 7 }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default ReturnTableSkeleton;