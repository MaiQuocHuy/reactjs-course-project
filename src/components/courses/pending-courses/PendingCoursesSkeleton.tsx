import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const PendingCoursesSkeleton = () => {
  // Generate skeleton rows
  const skeletonRows = Array.from({ length: 10 }, (_, index) => (
    <TableRow
      key={index}
      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
    >
      {/* Title */}
      <TableCell className="py-3 px-4">
        <Skeleton className="h-4 w-48" />
      </TableCell>

      {/* Instructor */}
      <TableCell className="py-3 px-4">
        <Skeleton className="h-4 w-32" />
      </TableCell>

      {/* Created Date */}
      <TableCell className="py-3 px-4">
        <Skeleton className="h-4 w-36" />
      </TableCell>

      {/* Last Update Date */}
      <TableCell className="py-3 px-4">
        <Skeleton className="h-4 w-36" />
      </TableCell>

      {/* Status */}
      <TableCell className="py-3 px-4">
        <Skeleton className="h-6 w-20 rounded-full" />
      </TableCell>

      {/* Actions */}
      <TableCell className="py-3 px-4">
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  ));

  return (
    <div className="space-y-2">
      {/* Header with title and refresh button */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>

      {/* Table container */}
      <div className="rounded-lg border shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="border-b border-gray-200">
              <TableHead className="py-3 px-4">
                <Skeleton className="h-4 w-12" />
              </TableHead>
              <TableHead className="py-3 px-4">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="py-3 px-4">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="py-3 px-4">
                <Skeleton className="h-4 w-28" />
              </TableHead>
              <TableHead className="py-3 px-4">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="py-3 px-4">
                <Skeleton className="h-4 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{skeletonRows}</TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
        <div className="flex items-center space-x-1">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default PendingCoursesSkeleton;
