import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  useGetPendingCoursesQuery,
  useUpdateCourseStatusMutation,
} from '@/services/coursesApi';
import NoCourseFound from '../NoCourseFound';
import { Pagination } from '../../shared';
import { Button } from '@/components/ui/button';
import CoursesTable from './CoursesTable';
import type { CourseReview } from '@/types/courses-review';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import PendingCoursesSkeleton from './PendingCoursesSkeleton';

// Define the schema for reject reason validation
const rejectFormSchema = z.object({
  reason: z
    .string()
    .min(10, { message: 'Rejection reason must be at least 10 characters.' })
    .max(500, { message: 'Rejection reason cannot exceed 500 characters.' }),
});

type RejectFormValues = z.infer<typeof rejectFormSchema>;

const PendingCourses = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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
    page: currentPage,
    size: itemsPerPage,
    sort: 'createdAt,desc',
  });

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

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
    return <PendingCoursesSkeleton />;
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

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Pending Courses</h2>
        <Button onClick={handleRetry} variant="outline" className="px-4">
          Refresh
        </Button>
      </div>

      <CoursesTable
        courses={courses}
        isUpdating={isUpdating}
        onAcceptCourse={(course) => {
          setSelectedCourse(course);
          setShowAcceptDialog(true);
        }}
        onRejectCourse={(course) => {
          setSelectedCourse(course);
          form.reset();
          setShowRejectDialog(true);
        }}
        getStatusBadgeColor={getStatusBadgeColor}
      />

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          pageInfo={pagination}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
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
