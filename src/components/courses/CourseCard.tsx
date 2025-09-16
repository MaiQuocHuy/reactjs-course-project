import type { Course } from '@/types/courses';
import { Link } from 'react-router-dom';
import { PermissionButton } from '@/components/shared/PermissionComponents';
import { Badge } from '../ui/badge';

type Props = {
  course: Course;
};

const getCourseLevelColor = (level?: string): string => {
  if (!level) return 'bg-blue-500';
  
  switch (level.toLowerCase()) {
    case 'beginner':
      return 'bg-green-500';
    case 'intermediate':
      return 'bg-yellow-500';
    case 'advanced':
      return 'bg-red-500';
    default:
      return 'bg-blue-500';
  }
};

const CourseCard = ({ course }: Props) => {
  return (
    <Link
      to={`/admin/courses/${course.id}`}
      target="_blank"
      className="relative bg-white rounded-lg shadow-sm overflow-hidden "
    >
      <div className="relative">
        {/* Thumbnail */}
        {course.thumbnailUrl && (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-40 object-cover"
          />
        )}

        {/* Level */}
        <div className={`absolute top-3 left-3 text-white text-sm px-2 py-1 rounded ${getCourseLevelColor(course.level)}`}>
          {course.level}
        </div>

        {/* Price */}
        <div className="absolute top-3 right-3 bg-purple-600 text-white text-sm px-2 py-1 rounded">
          ${course.price?.toFixed(2) ?? '0.00'}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{course.title}</h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {course.description}
        </p>

        {/* Categories */}
        <div className="flex items-center mb-3">
          {course.categories && course.categories.length > 0 ? (
            <div className="flex items-center gap-2 flex-wrap">
              {course.categories.slice(0, 2).map((category) => (
                <span
                  key={category.id}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {category.name}
                </span>
              ))}
              {course.categories.length > 2 && (
                <Badge
                  variant={'outline'}
                  className="text-xs text-gray-500 font-medium"
                >
                  +{course.categories.length - 2} more
                </Badge>
              )}
            </div>
          ) : (
            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              General
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          {/* Instructor Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-sm text-indigo-700">
              {course.instructor?.name
                ?.split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <div className="text-sm font-medium">
                {course.instructor?.name}
              </div>
              <div className="text-xs text-gray-500">Expert Instructor</div>
            </div>
          </div>

          {/* Ratings */}
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(course.averageRating ?? 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.376 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.631 9.393c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69L9.049 2.927z" />
                </svg>
              ))}
              <div className="text-xs text-gray-500 ml-2">
                {(course.averageRating ?? 0).toFixed(1)} (
                {course.ratingCount ?? 0})
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {course.sectionCount ?? 0} Lessons
          </div>

          <PermissionButton
            permissions={['course:READ']}
            className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/admin/courses/${course.id}`, '_blank');
            }}
          >
            View Course
          </PermissionButton>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
