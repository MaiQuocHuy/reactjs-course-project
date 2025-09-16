import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CourseContent from '@/components/courses/course-detail/course-content/CourseContent';
import { useGetCourseByIdQuery } from '@/services/coursesApi';
import NoCourseFound from '@/components/courses/NoCourseFound';
import CourseDetailSkeleton from './CourseDetailSkeleton';

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: courseData,
    isLoading,
    error,
    refetch,
  } = useGetCourseByIdQuery(id, { skip: !id });

  const handleRetry = useCallback(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);

  if (isLoading) {
    return <CourseDetailSkeleton />;
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
          <CardContent>
            {/* statistics: sections / lessons / total duration */}
            {/* <CourseStatistics
            countSection={mockCourseDetail.countSection}
            countLesson={mockCourseDetail.countLesson}
            totalDuration={mockCourseDetail.totalDuration}
          /> */}

            <CourseContent sections={courseData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseDetailPage;
