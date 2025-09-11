import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CourseCard from '@/components/courses/CourseCard';
import NoCourseFound from '@/components/courses/NoCourseFound';
import CourseSkeleton from '@/components/courses/CourseSkeleton';
import type { Course as CourseType } from '@/types/courses';
import { useGetAllCoursesQuery } from '@/services/coursesApi';

const ActiveCourses: React.FC = () => {
  // Local UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt,desc');
  const [viewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minRating, setMinRating] = useState<number>(0);
  const [showAdvancedFilters, setShowAdvancedFilters] =
    useState<boolean>(false);

  // Build API params (API uses 0-based page)
  const apiParams = useMemo(() => {
    return {
      page: currentPage - 1,
      size: itemsPerPage,
      sort: sortBy,
      search: searchQuery || undefined,
      minPrice,
      maxPrice,
      status: ['PUBLISHED', 'APPROVED'],
    } as any;
  }, [currentPage, itemsPerPage, sortBy, searchQuery, minPrice, maxPrice]);

  const { data, error, isLoading, refetch } = useGetAllCoursesQuery(apiParams);

  // Adapt backend response to local UI shape
  const courses: CourseType[] = data?.data?.content ?? [];
  const totalElements: number = data?.data?.page?.totalElements ?? 0;
  const totalPages: number = data?.data?.page?.totalPages ?? 0;

  useEffect(() => {
    // Reset to first page when filters/search changes
    setCurrentPage(1);
  }, [searchQuery, sortBy, itemsPerPage, minPrice, maxPrice]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <CourseSkeleton count={itemsPerPage} />;
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

  return (
    <>
      {/* Filters */}
      <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-3 h-4 w-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="11"
                cy="11"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              placeholder="Search courses by title or description"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full border rounded px-4 py-2 pl-10"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={'ALL'}
              onChange={() => {}}
              className="border rounded px-3 py-2 text-sm w-36"
            >
              <>
                <option>All Published</option>
                <option>Published</option>
                <option>Approved</option>
              </>
            </select>

            <select
              value={'ALL_CATS'}
              onChange={() => {}}
              className="border rounded px-3 py-2 text-sm w-48"
            >
              <option>All Categories</option>
              {Array.from(
                new Map(
                  courses
                    .flatMap((c) => c.categories ?? [])
                    .map((cat) => [cat.id, cat])
                ).values()
              ).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="border rounded px-3 py-2 text-sm flex items-center gap-2"
            >
              <span>🔍</span>
              <span>More Filters</span>
            </button>
          </div>
        </div>

        <div
          className={`mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded ${
            showAdvancedFilters ? '' : 'hidden'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div>
              <div className="text-sm font-medium mb-2">Rating</div>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="border rounded px-3 py-2 w-40"
              >
                <option value={0}>All stars</option>
                <option value={1}>1+ stars</option>
                <option value={2}>2+ stars</option>
                <option value={3}>3+ stars</option>
                <option value={4}>4+ stars</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Price Range</div>
                <button
                  onClick={() => {
                    setMinPrice(0);
                    setMaxPrice(500);
                  }}
                  className="px-3 py-1 bg-white border rounded text-sm"
                >
                  Reset
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-2 bg-white rounded shadow-sm text-sm">
                  ${(minPrice ?? 0).toFixed(2)}
                </div>
                <div className="flex-1">
                  <input
                    type="range"
                    min={0}
                    max={500}
                    value={minPrice ?? 0}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min={0}
                    max={500}
                    value={maxPrice ?? 500}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full mt-1"
                  />
                </div>
                <div className="px-3 py-2 bg-white rounded shadow-sm text-sm">
                  ${(maxPrice ?? 500).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <div>
                <div className="text-sm font-medium mb-2">Created Date</div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="createdAt,desc">Latest Date</option>
                  <option value="createdAt,asc">Oldest Date</option>
                </select>
              </div>

              <div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setMinPrice(undefined);
                    setMaxPrice(undefined);
                    setMinRating(0);
                    setSortBy('createdAt,desc');
                  }}
                  className="px-4 py-2 bg-white border rounded"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {courses.length === 0 ? (
        <NoCourseFound
          title="No published courses found"
          description="There are no published or approved courses matching your criteria."
          actionLabel="Clear filters"
          onAction={() => {
            setSearchQuery('');
            setMinPrice(undefined);
            setMaxPrice(undefined);
          }}
        />
      ) : (
        <>
          <div className="mb-8">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Show</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="px-3 py-1 border rounded cursor-pointer"
                >
                  «
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded cursor-pointer ${
                      currentPage === i + 1 ? 'bg-indigo-600 text-white ' : ''
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1 border rounded cursor-pointer"
                >
                  »
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Showing {Math.min(itemsPerPage, totalElements)} of{' '}
                {totalElements} results
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ActiveCourses;
