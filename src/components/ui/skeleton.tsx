/**
 * Lightweight skeleton primitives for loading states.
 * Uses a single CSS pulse animation — no JS overhead.
 */

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      aria-hidden="true"
    />
  );
}

/** Full-page skeleton matching the common page layout: title + list rows */
export function PageSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-6">
      {/* Title bar */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      {/* Content rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

/** Dashboard-specific skeleton with cards + list */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Reminders area */}
      <div className="space-y-2">
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
      {/* Today section */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
      {/* Upcoming section */}
      <div className="space-y-3">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </div>
  );
}
