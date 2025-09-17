import React from 'react';
import { format } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CourseReview } from '@/types/courses-review';

interface CoursesTableProps {
  courses: CourseReview[];
  isUpdating: boolean;
  onAcceptCourse: (course: CourseReview) => void;
  onRejectCourse: (course: CourseReview) => void;
  getStatusBadgeColor: (status: string) => string;
}

const CoursesTable: React.FC<CoursesTableProps> = ({
  courses,
  isUpdating,
  onAcceptCourse,
  onRejectCourse,
  getStatusBadgeColor,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow className="border-b border-gray-200">
            <TableHead className="py-3 px-4 text-gray-700 font-semibold">
              Title
            </TableHead>
            <TableHead className="py-3 px-4 text-gray-700 font-semibold">
              Instructor
            </TableHead>
            <TableHead className="py-3 px-4 text-gray-700 font-semibold">
              Created Date
            </TableHead>
            <TableHead className="py-3 px-4 text-gray-700 font-semibold">
              Last Update Date
            </TableHead>
            <TableHead className="py-3 px-4 text-gray-700 font-semibold">
              Status
            </TableHead>
            <TableHead className="py-3 px-4 text-gray-700 font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses
            .slice(
              0,
              location.pathname.includes('/admin/pending-courses')
                ? courses.length
                : 3
            )
            .map((course: CourseReview, index: number) => (
              <TableRow
                key={course.id}
                className={`transition-colors hover:bg-blue-50 cursor-pointer ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
                onClick={() => {
                  window.open(
                    `/admin/courses/review-course/${course.id}`,
                    '_blank'
                  );
                }}
              >
                <TableCell className="py-3 px-4 font-medium">
                  {course.title}
                </TableCell>
                <TableCell className="py-3 px-4">
                  {course.createdBy.name}
                </TableCell>
                <TableCell className="py-3 px-4 text-gray-600">
                  {format(new Date(course.createdAt), 'dd MMM yyyy, HH:mm')}
                </TableCell>
                <TableCell className="py-3 px-4 text-gray-600">
                  {course.statusUpdatedAt
                    ? format(
                        new Date(course.statusUpdatedAt),
                        'dd MMM yyyy, HH:mm'
                      )
                    : '-'}
                </TableCell>
                <TableCell className="py-3 px-4">
                  <Badge
                    className={`${getStatusBadgeColor(
                      course.status
                    )} px-3 py-1 rounded-full text-xs font-medium`}
                  >
                    {course.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 cursor-pointer transition-colors shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAcceptCourse(course);
                      }}
                      disabled={isUpdating}
                    >
                      Accept
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="cursor-pointer transition-colors shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRejectCourse(course);
                      }}
                      disabled={isUpdating}
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

          {!location.pathname.includes('/admin/pending-courses') &&
            courses.length > 3 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  <Button
                    onClick={() => navigate('/admin/pending-courses')}
                    variant="outline"
                    className="mx-auto cursor-pointer"
                  >
                    {`View All (${courses.length - 3} more)`}
                  </Button>
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CoursesTable;