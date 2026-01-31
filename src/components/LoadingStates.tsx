export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 h-4 w-3/4 rounded bg-gray-200"></div>
      <div className="mb-2 h-3 w-full rounded bg-gray-200"></div>
      <div className="mb-2 h-3 w-5/6 rounded bg-gray-200"></div>
      <div className="h-3 w-2/3 rounded bg-gray-200"></div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="animate-pulse p-4 sm:p-6 md:p-8">
      <div className="mb-6 h-8 w-1/3 rounded bg-gray-200"></div>
      <div className="mb-4 h-4 w-2/3 rounded bg-gray-200"></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
