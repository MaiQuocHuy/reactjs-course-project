import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

const ActiveCourseSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <>
      {/* Filters Skeleton */}
      <Card className="mb-6 shadow-lg border-0 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search bar skeleton */}
            <div className="relative flex-1">
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            {/* Category filter skeleton */}
            <Skeleton className="h-12 w-48 rounded-lg" />

            {/* Sort filter skeleton */}
            <Skeleton className="h-12 w-40 rounded-lg" />

            {/* More filters button skeleton */}
            <Skeleton className="h-12 w-32 rounded-xl" />
          </div>
        </CardContent>
      </Card>

      {/* Course Cards Skeleton */}
      <div className="mb-8">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <Card key={i} className="overflow-hidden shadow-sm">
              <div className="relative">
                {/* Thumbnail skeleton */}
                <Skeleton className="w-full h-40" />

                {/* Price badge skeleton */}
                <div className="absolute top-3 right-3">
                  <Skeleton className="h-6 w-16 rounded" />
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Title skeleton */}
                <Skeleton className="h-6 w-full" />

                {/* Description skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Categories skeleton */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Instructor info skeleton */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>

                {/* Rating and lessons skeleton */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>

                {/* View Course button skeleton */}
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-16" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <Skeleton className="h-6 w-32" />
      </div>
    </>
  );
};

export default ActiveCourseSkeleton;
