import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-5 gap-4 border-b p-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Body */}
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-5 gap-4 border-b p-4 last:border-b-0"
        >
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
};

const MaintenanceSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <TableSkeleton />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-5 w-36" />
        <TableSkeleton />
      </div>
    </div>
  );
};

export default MaintenanceSkeleton;
