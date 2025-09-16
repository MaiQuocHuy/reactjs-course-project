import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Skeleton } from '../ui/skeleton';

interface DiscountTableSkeletonProps {
  rows?: number;
}

const DiscountTableSkeleton: React.FC<DiscountTableSkeletonProps> = ({
  rows = 8,
}) => {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">
              <Skeleton className="h-4 w-8 mx-auto" />
            </TableHead>
            <TableHead className="w-[180px]">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead className="text-center">
              <Skeleton className="h-4 w-12 mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <Skeleton className="h-4 w-20 mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <Skeleton className="h-4 w-20 mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <Skeleton className="h-4 w-24 mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <Skeleton className="h-4 w-20 mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <Skeleton className="h-4 w-20 mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <Skeleton className="h-4 w-16 mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <Skeleton className="h-4 w-16 mx-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {/* No. */}
              <TableCell className="text-center">
                <Skeleton className="h-4 w-4 mx-auto" />
              </TableCell>

              {/* Code */}
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>

              {/* Type */}
              <TableCell className="text-center">
                <Skeleton className="h-4 w-16 mx-auto" />
              </TableCell>

              {/* Discount (%) */}
              <TableCell className="text-center">
                <Skeleton className="h-4 w-8 mx-auto" />
              </TableCell>

              {/* Usage Limit */}
              <TableCell className="text-center">
                <Skeleton className="h-4 w-12 mx-auto" />
              </TableCell>

              {/* Per User Limit */}
              <TableCell className="text-center">
                <Skeleton className="h-4 w-12 mx-auto" />
              </TableCell>

              {/* Start Date */}
              <TableCell className="text-center">
                <Skeleton className="h-4 w-20 mx-auto" />
              </TableCell>

              {/* End Date */}
              <TableCell className="text-center">
                <Skeleton className="h-4 w-20 mx-auto" />
              </TableCell>

              {/* Status */}
              <TableCell className="text-center">
                <Skeleton className="h-6 w-16 mx-auto rounded-full" />
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex justify-center">
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DiscountTableSkeleton;