import {
  useGetPendingCoursesQuery,
  useUpdateCourseStatusMutation,
} from '@/services/courses-api';
import { useCallback, useState } from 'react';
import CourseSkeleton from './CourseSkeleton';
import NoCourseFound from './NoCourseFound';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// Removed icon imports
import { format } from 'date-fns';
import type { CourseReview } from '@/types/courses-review';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

// Define the schema for reject reason validation
const rejectFormSchema = z.object({
  reason: z
    .string()
    .min(10, { message: 'Rejection reason must be at least 10 characters.' })
    .max(500, { message: 'Rejection reason cannot exceed 500 characters.' }),
});

type RejectFormValues = z.infer<typeof rejectFormSchema>;

const PendingCourses = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [selectedCourse, setSelectedCourse] = useState<CourseReview | null>(
    null
  );
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showAllRows, setShowAllRows] = useState(false);

  // Form setup for rejection reason
  const form = useForm<RejectFormValues>({
    resolver: zodResolver(rejectFormSchema),
    defaultValues: {
      reason: '',
    },
  });

  // API mutations
  const [updateCourseStatus, { isLoading: isUpdating }] =
    useUpdateCourseStatusMutation();

  const {
    data: pendingCourses,
    isLoading,
    error,
    refetch,
  } = useGetPendingCoursesQuery({
    page,
    size,
    sort: 'createdAt,desc',
  });

  const navigate = useNavigate();
  const location = useLocation();

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAcceptCourse = async () => {
    if (!selectedCourse) return;

    try {
      await updateCourseStatus({
        id: selectedCourse.id,
        status: 'APPROVED',
      }).unwrap();
      toast.success('Course accepted successfully!');
      refetch();
    } catch (error) {
      console.error('Failed to accept course:', error);
      toast.error('Failed to accept course. Please try again.');
    } finally {
      setShowAcceptDialog(false);
      setSelectedCourse(null);
    }
  };

  const handleRejectCourse = async (values: RejectFormValues) => {
    if (!selectedCourse) return;

    try {
      await updateCourseStatus({
        id: selectedCourse.id,
        status: 'REJECTED',
        reason: values.reason,
      }).unwrap();
      toast.success('Course rejected successfully!');
      refetch();
    } catch (error) {
      console.error('Failed to reject course:', error);
      toast.error('Failed to reject course. Please try again.');
    } finally {
      setShowRejectDialog(false);
      setSelectedCourse(null);
      form.reset();
    }
  };

  const onDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      setShowRejectDialog(false);
      form.reset();
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'RESUBMITTED':
        return 'bg-amber-500 hover:bg-amber-600 text-white';
      case 'PENDING':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      default:
        // Other statuses
        return 'bg-red-500 hover:bg-red-600 text-white';
    }
  };

  if (isLoading) {
    return <CourseSkeleton count={10} />;
  }

  if (error) {
    return (
      <NoCourseFound
        title="Failed to load reviewed courses"
        description={String((error as any).error ?? 'Unknown error')}
        actionLabel="Try again"
        onAction={handleRetry}
      />
    );
  }

  if (!pendingCourses || pendingCourses.content.length === 0) {
    if (location.pathname === '/admin/courses') {
      return (
        <NoCourseFound
          title="No pending courses found"
          description="There are no courses pending review at the moment."
          actionLabel="Refresh"
          onAction={handleRetry}
        />
      );
    } else {
      return <></>;
    }
  }

  const { content: courses, page: pagination } = pendingCourses;

  // Generate array of page numbers for pagination
  const pageNumbers = [];
  for (let i = 0; i < pagination.totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Pending Courses</h2>
        <Button onClick={handleRetry} variant="outline" className="px-4">
          Refresh
        </Button>
      </div>

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
                location.pathname == '/admin/courses' ? courses.length : 3
              )
              .map((course: CourseReview, index: number) => (
                <TableRow
                  key={course.id}
                  className={`transition-colors hover:bg-blue-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <TableCell
                    className="py-3 px-4 cursor-pointer font-medium"
                    onClick={() =>
                      navigate(`/admin/courses/review-course/${course.id}`)
                    }
                  >
                    {course.title}
                  </TableCell>
                  <TableCell
                    className="py-3 px-4 cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/courses/review-course/${course.id}`)
                    }
                  >
                    {course.createdBy.name}
                  </TableCell>
                  <TableCell
                    className="py-3 px-4 cursor-pointer text-gray-600"
                    onClick={() =>
                      navigate(`/admin/courses/review-course/${course.id}`)
                    }
                  >
                    {format(new Date(course.createdAt), 'dd MMM yyyy, HH:mm')}
                  </TableCell>
                  <TableCell
                    className="py-3 px-4 cursor-pointer text-gray-600"
                    onClick={() =>
                      navigate(`/admin/courses/review-course/${course.id}`)
                    }
                  >
                    {course.statusUpdatedAt
                      ? format(
                          new Date(course.statusUpdatedAt),
                          'dd MMM yyyy, HH:mm'
                        )
                      : '-'}
                  </TableCell>
                  <TableCell
                    className="py-3 px-4 cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/courses/review-course/${course.id}`)
                    }
                  >
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
                          setSelectedCourse(course);
                          setShowAcceptDialog(true);
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
                          setSelectedCourse(course);
                          form.reset();
                          setShowRejectDialog(true);
                        }}
                        disabled={isUpdating}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

            {location.pathname !== '/admin/courses' && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  <Button
                    onClick={() => navigate('/admin/courses')}
                    variant="outline"
                    className="mx-auto cursor-pointer"
                  >
                    {showAllRows
                      ? 'View Less'
                      : `View All (${courses.length - 3} more)`}
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Showing {pagination.number * size + 1}-
            {Math.min((pagination.number + 1) * size, pagination.totalElements)}{' '}
            of {pagination.totalElements} courses
          </p>

          <Pagination className="shadow-sm">
            <PaginationContent className="bg-white rounded-lg border overflow-hidden">
              {!pagination.first && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                    className="hover:bg-gray-50 transition-colors font-medium"
                  />
                </PaginationItem>
              )}

              {pageNumbers.map((num) => (
                <PaginationItem key={num}>
                  <PaginationLink
                    onClick={() => handlePageChange(num)}
                    isActive={pagination.number === num}
                    className={`${
                      pagination.number === num
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'hover:bg-gray-50'
                    } transition-colors`}
                  >
                    {num + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {!pagination.last && (
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(page + 1)}
                    className="hover:bg-gray-50 transition-colors font-medium"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Accept Course Confirmation Dialog */}
      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent className="max-w-md shadow-lg">
          <AlertDialogHeader>
            <div className="mb-2">
              <AlertDialogTitle className="text-xl text-green-600">
                Accept Course
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-gray-700 space-y-2">
              <p>Are you sure you want to accept this course?</p>
              <div className="p-3 bg-gray-50 rounded-md border border-gray-100 my-2">
                <p className="font-medium text-gray-800">
                  {selectedCourse?.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Instructor: {selectedCourse?.createdBy.name}
                </p>
              </div>
              <p>
                By accepting, this course will be available to all users on the
                platform.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              disabled={isUpdating}
              className="border border-gray-300 shadow-sm"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAcceptCourse}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 shadow-sm transition-colors"
            >
              {isUpdating ? 'Accepting...' : 'Accept Course'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Course Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={onDialogClose}>
        <AlertDialogContent className="max-w-md shadow-lg">
          <AlertDialogHeader>
            <div className="mb-2">
              <AlertDialogTitle className="text-xl text-red-600">
                Reject Course
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-gray-700 space-y-2">
              <p>Please provide a reason for rejecting this course:</p>
              <div className="p-3 bg-gray-50 rounded-md border border-gray-100 my-2">
                <p className="font-medium text-gray-800">
                  {selectedCourse?.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Instructor: {selectedCourse?.createdBy.name}
                </p>
              </div>
              <p>This reason will be sent directly to the instructor.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleRejectCourse)}
              className="space-y-4 py-2"
            >
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">
                      Rejection Reason
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide a detailed explanation for rejecting this course..."
                        className="min-h-28 resize-none border-gray-300 focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <AlertDialogFooter className="gap-2 pt-2">
                <AlertDialogCancel
                  type="button"
                  disabled={isUpdating}
                  onClick={() => form.reset()}
                  className="border border-gray-300 shadow-sm"
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isUpdating}
                  className="shadow-sm transition-colors"
                >
                  {isUpdating ? 'Rejecting...' : 'Submit Rejection'}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PendingCourses;
