interface SkeletonProps {
  className?: string;
}

/** A single shimmering placeholder block. Compose these to match the shape
 * of the content that's loading (a line of text, an avatar circle, a card). */
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 ${className}`}
    />
  );
}

export function SkeletonTable({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="card !p-0 overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800">
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-6 px-5 py-4">
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
            {Array.from({ length: columns - 1 }).map((_, c) => (
              <Skeleton key={c} className="h-3 w-24 max-w-[30%] flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card">
          <Skeleton className="mb-3 h-10 w-10 rounded-lg" />
          <Skeleton className="mb-2 h-7 w-14" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}