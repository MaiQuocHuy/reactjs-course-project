import React, { useCallback, useEffect, useMemo, useState } from 'react';

import CourseCard from '@/components/courses/CourseCard';
import NoCourseFound from '@/components/courses/NoCourseFound';
import ActiveCourseSkeleton from '@/components/courses/active-courses/ActiveCourseSkeleton';
import type { Course as CourseType } from '@/types/courses';
import {
  useGetAllCoursesQuery,
  useGetMinAndMaxPriceQuery,
} from '@/services/coursesApi';
import { useGetAllCategoriesDropdownQuery } from '@/services/categoriesApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { Pagination } from '@/components/shared';
import CourseCardSkeleton from './CourseCardSkeleton';

const ActiveCourses: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt,desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(999.99);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] =
    useState<boolean>(false);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  // Fetch categories
  const { data: categoriesData } = useGetAllCategoriesDropdownQuery();

  // Build API params for filtered courses
  const apiParams = useMemo(() => {
    return {
      page: currentPage,
      size: itemsPerPage,
      sort: sortBy,
      search: searchQuery || undefined,
      minPrice,
      maxPrice,
      categoryId: selectedCategoryId === 'all' ? undefined : selectedCategoryId,
      level: selectedLevel === 'all' ? undefined : selectedLevel,
      averageRating:
        selectedRating === 'all' ? undefined : parseFloat(selectedRating),
    } as any;
  }, [
    currentPage,
    itemsPerPage,
    sortBy,
    searchQuery,
    minPrice,
    maxPrice,
    selectedCategoryId,
    selectedLevel,
    selectedRating,
  ]);

  const { data, error, isLoading, refetch } = useGetAllCoursesQuery(apiParams);

  const courses: CourseType[] = data?.content ?? [];

  const { data: metadata } = useGetMinAndMaxPriceQuery();
  const actualMinPrice = metadata?.minPrice ?? 0;
  const actualMaxPrice = metadata?.maxPrice ?? 999.99;

  // Initialize price range with actual values when they're first loaded
  useEffect(() => {
    if (actualMinPrice !== undefined && actualMaxPrice !== undefined) {
      setMinPrice(actualMinPrice);
      setMaxPrice(actualMaxPrice);
    }
  }, [actualMinPrice, actualMaxPrice]);

  // Determine if any filters are active
  useEffect(() => {
    const filtering =
      searchQuery !== '' ||
      selectedCategoryId !== 'all' ||
      selectedLevel !== 'all' ||
      selectedRating !== 'all' ||
      minPrice !== actualMinPrice ||
      maxPrice !== actualMaxPrice;
    setIsFiltering(filtering);
  }, [
    searchQuery,
    selectedCategoryId,
    selectedLevel,
    selectedRating,
    minPrice,
    maxPrice,
    actualMinPrice,
    actualMaxPrice,
  ]);

  // Reset filtering state when courses load
  useEffect(() => {
    if (courses) {
      setIsFiltering(false);
    }
  }, [courses]);

  useEffect(() => {
    // Reset to first page when filters/search changes
    setCurrentPage(0);
  }, [
    searchQuery,
    sortBy,
    itemsPerPage,
    minPrice,
    maxPrice,
    selectedCategoryId,
    selectedLevel,
    selectedRating,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <ActiveCourseSkeleton count={itemsPerPage} />;
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
      <Card className="mb-6 shadow-lg border-0 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search bar */}
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-500"
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
              </div>
              <Input
                placeholder="Search courses by title or description..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md"
              />
            </div>

            {/* Filter by category */}
            <Select
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
            >
              <SelectTrigger className="rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-800 shadow-sm">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🌐 All Categories</SelectItem>
                {categoriesData?.data?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    📚 {category.name}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {category.courseCount}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter by created date */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt,desc">📅 Latest Date</SelectItem>
                <SelectItem value="createdAt,asc">📅 Oldest Date</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`rounded-xl px-5 py-3 font-medium transition-all duration-200 ${
                showAdvancedFilters
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md'
              }`}
              variant={showAdvancedFilters ? 'default' : 'outline'}
            >
              <Filter className="mr-2 h-4 w-4" />
              {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
            </Button>
          </div>

          {showAdvancedFilters && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-inner">
              {/* Filter by Price Range */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <span className="text-lg">💰</span>
                      Price Range
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 px-3 py-1 rounded-full font-medium"
                    >
                      ${minPrice} - ${maxPrice}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMinPrice(actualMinPrice);
                      setMaxPrice(actualMaxPrice);
                    }}
                    className="rounded-full px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    ↻ Reset
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-sm">
                    <Slider
                      value={[minPrice, maxPrice]}
                      onValueChange={(value) => {
                        setMinPrice(value[0]);
                        setMaxPrice(value[1]);
                      }}
                      max={actualMaxPrice}
                      min={actualMinPrice}
                      step={Math.max(
                        1,
                        Math.floor((actualMaxPrice - actualMinPrice) / 100)
                      )}
                      className="w-full"
                      aria-label="Price range"
                    />
                  </div>
                  <div className="flex items-center justify-between px-2">
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700 px-3 py-1 rounded-full font-medium"
                    >
                      Min: ${actualMinPrice}
                    </Badge>
                    <div className="flex-1 mx-4 h-0.5 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 dark:from-gray-600 dark:via-gray-400 dark:to-gray-600 rounded-full"></div>
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700 px-3 py-1 rounded-full font-medium"
                    >
                      Max: ${actualMaxPrice}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Filter by Level */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <span className="text-lg">📊</span>
                  Levels
                </label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500 transition-all duration-200 bg-white dark:bg-gray-800 shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🎯 All Levels</SelectItem>
                    <SelectItem value="BEGINNER">🌱 Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">
                      🚀 Intermediate
                    </SelectItem>
                    <SelectItem value="ADVANCED">⭐ Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter by Ratings */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <span className="text-lg">⭐</span>
                  Ratings
                </label>
                <Select
                  value={selectedRating}
                  onValueChange={setSelectedRating}
                >
                  <SelectTrigger className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-yellow-300 dark:hover:border-yellow-500 transition-all duration-200 bg-white dark:bg-gray-800 shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ 4+ Stars</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ 3+ Stars</SelectItem>
                    <SelectItem value="2">⭐⭐ 2+ Stars</SelectItem>
                    <SelectItem value="1">⭐ 1+ Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <div className="lg:col-span-4 flex justify-end mt-2 border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setMinPrice(actualMinPrice);
                    setMaxPrice(actualMaxPrice);
                    setSelectedCategoryId('all');
                    setSelectedLevel('all');
                    setSelectedRating('all');
                    setSortBy('createdAt,desc');
                  }}
                  className="rounded-full py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 border-2 border-gray-300 dark:border-gray-600 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  🔄 Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isFiltering ? (
        <CourseCardSkeleton count={itemsPerPage} />
      ) : courses.length === 0 ? (
        <NoCourseFound
          title="No published courses found"
          description="There are no published or approved courses matching your criteria."
          actionLabel="Clear filters"
          onAction={() => {
            setSearchQuery('');
            setMinPrice(actualMinPrice);
            setMaxPrice(actualMaxPrice);
            setSelectedCategoryId('all');
            setSelectedLevel('all');
            setSelectedRating('all');
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
          {data && data.page && data.page.totalPages >= 1 && (
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              pageInfo={data.page}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </>
      )}
    </>
  );
};

export default ActiveCourses;
