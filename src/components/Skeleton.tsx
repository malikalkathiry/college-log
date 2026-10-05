/** Blok abu-abu untuk skeleton loading. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-surface-hover ${className}`} />;
}

/** Skeleton baris daftar (judul + subjudul). */
export function SkeletonRow() {
  return (
    <div className="rounded border border-border bg-surface px-3 py-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="mt-2 h-3 w-1/3" />
    </div>
  );
}

/** Skeleton halaman: header + beberapa baris. */
export default function PageSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-border px-4 py-4">
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="flex-1 space-y-2 px-4 py-4">
        {Array.from({ length: rows }).map((_, index) => (
          <SkeletonRow key={index} />
        ))}
      </div>
    </div>
  );
}
