import DiscountTableSkeleton from '@/components/discounts/DiscountTableSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

const DiscountPageSkeleton = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        {/* Filters skeleton */}
        <div className="p-4 flex justify-between items-center border-b">
          <Skeleton className="h-6 w-48" />
          <div className="flex items-center gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-32" />
              </div>
            ))}
          </div>
        </div>

        {/* Discount Table Skeleton */}
        <DiscountTableSkeleton />
      </div>
    </div>
  );
};

export default DiscountPageSkeleton;
