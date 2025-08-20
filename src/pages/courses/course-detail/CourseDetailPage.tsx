import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CourseContent from '@/components/courses/course-detail/course-content/CourseContent';
import { useGetCourseByIdQuery } from '@/services/courses-api';
import CourseSkeleton from '@/components/courses/CourseSkeleton';
import NoCourseFound from '@/components/courses/NoCourseFound';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    data: courseData,
    isLoading,
    error,
    refetch,
  } = id ? useGetCourseByIdQuery(id) : { data: undefined };

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
          <CardContent>
            {/* statistics: sections / lessons / total duration */}
            {/* <CourseStatistics
            countSection={mockCourseDetail.countSection}
            countLesson={mockCourseDetail.countLesson}
            totalDuration={mockCourseDetail.totalDuration}
          /> */}

            <CourseContent sections={courseData.data} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseDetailPage;
