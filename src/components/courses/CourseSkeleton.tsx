const CourseSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-64">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="mb-8">
              <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: count }).map((_, i) => (
                <div
                  key={i}
                  className="h-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSkeleton;
