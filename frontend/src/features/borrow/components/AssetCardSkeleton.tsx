const AssetCardSkeleton = () => (
  <div className="rounded-lg border bg-card p-4 space-y-3 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="p-2 rounded-md bg-muted w-8 h-8" />
      <div className="h-5 w-12 rounded-full bg-muted" />
    </div>
    <div className="space-y-1.5">
      <div className="h-4 w-3/4 rounded bg-muted" />
      <div className="h-3 w-1/2 rounded bg-muted" />
    </div>
    <div className="h-8 w-full rounded bg-muted" />
  </div>
);

export default AssetCardSkeleton;
