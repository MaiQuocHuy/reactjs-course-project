import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  count?: number;
};

const CourseCardSkeleton = ({ count = 6 }: Props) => {
  return (
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
  );
};

export default CourseCardSkeleton;
