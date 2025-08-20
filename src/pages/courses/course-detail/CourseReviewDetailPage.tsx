import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CourseContent from '@/components/courses/course-detail/course-content/CourseContent';
import { 
  useGetPendingCoursesByIdQuery,
} from '@/services/courses-api';
import CourseSkeleton from '@/components/courses/CourseSkeleton';
import NoCourseFound from '@/components/courses/NoCourseFound';
import { Button } from '@/components/ui/button';
import { ArrowLeft} from 'lucide-react';
import CourseStatistics from '@/components/courses/course-detail/course-content/CourseStatistics';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the schema for form validation
const rejectFormSchema = z.object({
  reason: z
    .string()
    .min(10, { message: "Rejection reason must be at least 10 characters." })
    .max(500, { message: "Rejection reason cannot exceed 500 characters." }),
});

type RejectFormValues = z.infer<typeof rejectFormSchema>;

const CourseReviewDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: courseData,
    isLoading,
    error,
    refetch,
  } = id ? useGetPendingCoursesByIdQuery(id) : { data: undefined };

  const handleRetry = useCallback(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);

  if (isLoading) {
    return <CourseSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <NoCourseFound
            title="Failed to load course"
            description={String((error as any).error ?? 'Unknown error')}
            actionLabel="Try again"
            onAction={handleRetry}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="lg"
          className="cursor-pointer"
          onClick={() => navigate('/admin/courses')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-lg font-medium">Back to Courses</span>
      </div>

      {/* Instructor information */}
      {/* {instructor && <InstructorInfo instructor={instructor} />} */}

      {/* Course basic information */}
      {/* <CourseBasicInfo course={mockCourseDetail} /> */}

      {/* Course content */}
      {courseData && (
        <Card>
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* statistics: sections / lessons / total duration */}
            <CourseStatistics
              countSection={courseData.countSection}
              countLesson={courseData.countLesson}
              totalDuration={courseData.totalDuration}
            />
            <CourseContent sections={courseData.sections} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseReviewDetailPage;
