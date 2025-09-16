import { Skeleton } from '@/components/ui/skeleton';

const CourseDetailSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Course Content Header */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" /> {/* Course Content title */}
        
        {/* Stats cards */}
        <div className="flex gap-4">
          <div className="bg-blue-50 rounded-lg p-4 flex-1">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-8" />
          </div>
          <div className="bg-green-50 rounded-lg p-4 flex-1">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-8" />
          </div>
          <div className="bg-purple-50 rounded-lg p-4 flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </div>

      {/* Section 1 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-4" /> {/* Expand icon */}
          <Skeleton className="h-4 w-4" /> {/* Section icon */}
          <Skeleton className="h-5 w-32" /> {/* Section 1 */}
          <Skeleton className="h-4 w-40" /> {/* Section title */}
        </div>

        {/* Lessons header */}
        <div className="ml-7">
          <Skeleton className="h-4 w-20 mb-3" />
        </div>

        {/* Lesson 1 */}
        <div className="ml-7 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4" /> {/* Expand icon */}
            <Skeleton className="h-4 w-4" /> {/* Play icon */}
            <Skeleton className="h-4 w-20" /> {/* Lesson 1 */}
            <Skeleton className="h-4 w-48" /> {/* Lesson title */}
            <Skeleton className="h-5 w-12 rounded" /> {/* Video badge */}
          </div>

          {/* Lesson video section */}
          <div className="ml-7 space-y-3">
            <Skeleton className="h-4 w-24" /> {/* Lesson video title */}
            
            {/* Video player skeleton */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <Skeleton className="h-80 w-full bg-gray-800" />
              
              {/* Video controls overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full bg-white/20" /> {/* Play button */}
                  <div className="flex-1 flex items-center gap-2">
                    <Skeleton className="h-1 flex-1 bg-white/30 rounded" /> {/* Progress bar */}
                    <Skeleton className="h-4 w-16 bg-white/50" /> {/* Time */}
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-6 bg-white/20" /> {/* Volume */}
                    <Skeleton className="h-6 w-6 bg-white/20" /> {/* Fullscreen */}
                    <Skeleton className="h-6 w-6 bg-white/20" /> {/* More options */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-4" /> {/* Expand icon */}
          <Skeleton className="h-4 w-4" /> {/* Section icon */}
          <Skeleton className="h-5 w-32" /> {/* Section 2 */}
          <Skeleton className="h-4 w-44" /> {/* Section title */}
        </div>
      </div>

      {/* Additional sections placeholder */}
      <div className="space-y-3">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    </div>
  );
};

export default CourseDetailSkeleton;