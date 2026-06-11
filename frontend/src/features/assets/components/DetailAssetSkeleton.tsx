import { Skeleton } from "@/components/ui/skeleton";

const DetailAssetSkeleton = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Back button */}
      <Skeleton className="h-4 w-20" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Informasi Aset */}
        <div className="rounded-lg border bg-card p-5 space-y-3">
          <Skeleton className="h-3 w-28" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {/* Status & Kondisi */}
          <div className="rounded-lg border bg-card p-5 space-y-3">
            <Skeleton className="h-3 w-28" />
            <div className="flex items-center justify-between py-2 border-b">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="flex items-center justify-between py-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>

          {/* Tanggal */}
          <div className="rounded-lg border bg-card p-5 space-y-3">
            <Skeleton className="h-3 w-20" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Riwayat Peminjaman */}
      <div className="rounded-lg border bg-card">
        <div className="px-5 py-4 border-b">
          <Skeleton className="h-3 w-36" />
        </div>
        <div className="p-4 space-y-3">
          {/* Table header */}
          <div className="flex gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
          {/* Table rows */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-2 border-t">
              {Array.from({ length: 6 }).map((_, j) => (
                <Skeleton key={j} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailAssetSkeleton;