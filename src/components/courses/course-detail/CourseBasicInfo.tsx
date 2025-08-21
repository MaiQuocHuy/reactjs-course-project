import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Course } from '@/types/courses-review';

type Props = {
  course: Course;
};

const CourseBasicInfo = ({ course }: Props) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Course Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Title and description */}
          <div>
            <h3 className="font-semibold text-lg">{course.title}</h3>
            <p className="text-muted-foreground mt-1">{course.description}</p>
          </div>

          <div className="flex flex-wrap gap-3 h-5">
            {/* Course categories */}
            <div className="flex gap-1 flex-wrap">
              {course.categories.map((category) => (
                <Badge key={category.id} variant="secondary">
                  {category.name.charAt(0).toUpperCase() +
                    category.name.slice(1)}{' '}
                </Badge>
              ))}
            </div>

            <Separator orientation="vertical" />

            {/* Level */}
            <Badge variant="outline">Level: {course.level}</Badge>
            <Separator orientation="vertical" />

            {/* Price */}
            <Badge variant="default">
              Price: ${course.price.toLocaleString()}
            </Badge>
          </div>

          {/* Course image */}
          <div>
            <img
              src={course.thumbnailUrl}
              alt={course.title || 'Course image'}
              className="rounded-lg w-full max-h-[45vh] object-cover"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseBasicInfo;
