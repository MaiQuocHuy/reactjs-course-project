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
import { Check, X } from 'lucide-react';
import { format } from 'date-fns';
import type { CourseReview } from '@/types/courses-review';
import { useNavigate } from 'react-router-dom';
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
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        // Pending
        return 'bg-red-500 hover:bg-red-600';
    }
  };

  if (isLoading) {
    return <CourseSkeleton count={10} />;
  }

  if (error) {
    return (
      <NoCourseFound
        title="Failed to load courses"
        description={String((error as any).error ?? 'Unknown error')}
        actionLabel="Try again"
        onAction={handleRetry}
      />
    );
  }

  if (!pendingCourses || pendingCourses.content.length === 0) {
    return (
      <NoCourseFound
        title="No pending courses found"
        description="There are no courses pending review at the moment."
        actionLabel="Refresh"
        onAction={handleRetry}
      />
    );
  }

  const { content: courses, page: pagination } = pendingCourses;

  // Generate array of page numbers for pagination
  const pageNumbers = [];
  for (let i = 0; i < pagination.totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Pending Courses</h2>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Last Update Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course: CourseReview) => (
              <TableRow key={course.id} className="hover:bg-gray-100">
                <TableCell
                  className="font-medium cursor-pointer"
                  onClick={() =>
                    navigate(`/admin/courses/review-course/${course.id}`)
                  }
                >
                  {course.id}
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/admin/courses/review-course/${course.id}`)
                  }
                >
                  {course.title}
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/admin/courses/review-course/${course.id}`)
                  }
                >
                  {course.createdBy.name}
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/admin/courses/review-course/${course.id}`)
                  }
                >
                  {format(new Date(course.createdAt), 'dd-MM-yy HH:mm')}
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/admin/courses/review-course/${course.id}`)
                  }
                >
                  {course.statusUpdatedAt
                    ? format(new Date(course.statusUpdatedAt), 'dd-MM-yy HH:mm')
                    : '-'}
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/admin/courses/review-course/${course.id}`)
                  }
                >
                  <Badge className={getStatusBadgeColor(course.status)}>
                    {course.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCourse(course);
                        setShowAcceptDialog(true);
                      }}
                      disabled={isUpdating}
                    >
                      <Check className="w-4 h-4 mr-1" /> Accept
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCourse(course);
                        form.reset();
                        setShowRejectDialog(true);
                      }}
                      disabled={isUpdating}
                    >
                      <X className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {!pagination.first && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                />
              </PaginationItem>
            )}

            {pageNumbers.map((num) => (
              <PaginationItem key={num}>
                <PaginationLink
                  onClick={() => handlePageChange(num)}
                  isActive={pagination.number === num}
                >
                  {num + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {!pagination.last && (
              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(page + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}

      {/* Accept Course Confirmation Dialog */}
      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to accept this course?
              <br />
              <strong>{selectedCourse?.title}</strong>
              <br />
              By accepting, this course will be available to all users on the
              platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAcceptCourse}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUpdating ? 'Accepting...' : 'Accept Course'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Course Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={onDialogClose}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Course</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this course:
              <br />
              <strong>{selectedCourse?.title}</strong>
              <br />
              This reason will be sent to the instructor.
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
                    <FormLabel>Rejection Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide a detailed explanation for rejecting this course..."
                        className="min-h-28 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AlertDialogFooter className="gap-2 pt-2">
                <AlertDialogCancel
                  type="button"
                  disabled={isUpdating}
                  onClick={() => form.reset()}
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isUpdating}
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
