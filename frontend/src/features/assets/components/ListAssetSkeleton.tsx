import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const ListAssetsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-row items-center justify-between">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-10 w-30" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border bg-card shadow-sm overflow-x-auto">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-30" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-30" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-30" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-30" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-30" />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-30" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-25" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-25" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-25" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-6 w-6 rounded-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ListAssetsSkeleton;
