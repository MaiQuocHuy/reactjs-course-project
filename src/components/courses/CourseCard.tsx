import type { Course } from '@/types/courses';
import { Link } from 'react-router-dom';
type Props = {
  course: Course;
};

const CourseCard = ({ course }: Props) => {
  return (
    <Link
      to={`/admin/courses/${course.id}`}
      className="relative bg-white rounded-lg shadow-sm overflow-hidden "
    >
      <div className="relative">
        {course.thumbnailUrl && (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-40 object-cover"
          />
        )}
        <div className="absolute top-3 left-3 bg-white/80 text-xs px-2 py-1 rounded">
          {course.categories?.[0]?.name ?? 'General'}
        </div>
        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded">
          ${course.price?.toFixed(2) ?? '0.00'}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between">
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
          <button className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer">
            View Course
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
