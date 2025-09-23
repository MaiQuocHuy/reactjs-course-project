import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import CourseCardSkeleton from './CourseCardSkeleton';

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
      <CourseCardSkeleton count={count} />

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
