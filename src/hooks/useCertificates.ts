import { useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useGetCertificatesQuery,
  useGetCertificatesByCourseQuery,
  useGetCertificatesByUserQuery,
} from '@/services/certificatesApi';
import { useGetAllCoursesQuery } from '@/services/coursesApi';
import { useGetUsersQuery } from '@/services/usersApi';
import type {
  CertificateFilters,
  UseCertificatesResult,
  UseCoursesResult,
  UseUsersResult,
} from '@/types/certificates';

interface UseCertificatesOptions {
  filters: CertificateFilters;
}

/**
 * Custom hook for managing certificates with mode switching and params
 * Handles debounced search, mode switching, and data fetching
 */
export function useCertificates({ filters }: UseCertificatesOptions): UseCertificatesResult {
  const { mode, search, selectedCourseId, selectedUserId, page, size } = filters;
  
  // Debounce search only for "all" mode (350ms as requested)
  const debouncedSearch = useDebounce(search, 350);
  
  // API calls based on mode
  const {
    data: allCertificatesData,
    isLoading: isLoadingAll,
    error: errorAll,
    refetch: refetchAll,
  } = useGetCertificatesQuery(
    {
      search: mode === 'all' ? debouncedSearch : undefined,
      page,
      size,
      sort: 'issuedAt,desc',
    },
    { skip: mode !== 'all' }
  );

  const {
    data: courseCertificatesData,
    isLoading: isLoadingCourse,
    error: errorCourse,
    refetch: refetchCourse,
  } = useGetCertificatesByCourseQuery(
    { courseId: selectedCourseId, page, size },
    { skip: mode !== 'course' || !selectedCourseId }
  );

  const {
    data: userCertificatesData,
    isLoading: isLoadingUser,
    error: errorUser,
    refetch: refetchUser,
  } = useGetCertificatesByUserQuery(
    { userId: selectedUserId, page, size },
    { skip: mode !== 'user' || !selectedUserId }
  );

  // Memoized result based on current mode
  const result = useMemo((): UseCertificatesResult => {
    switch (mode) {
      case 'course':
        return {
          certificates: courseCertificatesData?.content || [],
          isLoading: isLoadingCourse,
          error: errorCourse,
          pagination: courseCertificatesData?.page,
          refetch: refetchCourse,
        };
      case 'user':
        return {
          certificates: userCertificatesData?.content || [],
          isLoading: isLoadingUser,
          error: errorUser,
          pagination: userCertificatesData?.page,
          refetch: refetchUser,
        };
      default: // 'all'
        return {
          certificates: allCertificatesData?.content || [],
          isLoading: isLoadingAll,
          error: errorAll,
          pagination: allCertificatesData?.page,
          refetch: refetchAll,
        };
    }
  }, [
    mode,
    allCertificatesData,
    courseCertificatesData,
    userCertificatesData,
    isLoadingAll,
    isLoadingCourse,
    isLoadingUser,
    errorAll,
    errorCourse,
    errorUser,
    refetchAll,
    refetchCourse,
    refetchUser,
  ]);

  return result;
}

/**
 * Hook for fetching courses with long-term caching and client-side search
 */
export function useCourses(searchQuery = ""): UseCoursesResult {
  const {
    data: coursesResponse,
    isLoading,
    error,
  } = useGetAllCoursesQuery({});

  const courses = useMemo(() => {
    if (!coursesResponse?.data?.content) return [];
    
    const allCourses = coursesResponse.data.content;
    
    // Transform courses to match our Certificate Course interface
    const transformedCourses = allCourses.map(course => ({
      id: course.id,
      title: course.title,
      instructor: typeof course.instructor === 'object' 
        ? course.instructor.name 
        : course.instructor || 'Unknown Instructor',
      description: course.description,
      createdAt: course.createdAt,
    }));
    
    if (!searchQuery.trim()) return transformedCourses;
    
    return transformedCourses.filter(course =>
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [coursesResponse, searchQuery]);

  return {
    courses,
    isLoading,
    error,
  };
}

/**
 * Hook for fetching users with long-term caching and client-side search
 */
export function useUsers(searchQuery = ""): UseUsersResult {
  const {
    data: usersResponse,
    isLoading,
    error,
  } = useGetUsersQuery({
     // Get more users at once
    role: "STUDENT", // Filter for students only
    isActive: true, // Only active users
  });

  const users = useMemo(() => {
    if (!usersResponse?.data?.users) return [];
    
    const allUsers = usersResponse.data.users;
    
    if (!searchQuery.trim()) return allUsers;
    
    return allUsers.filter(user =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [usersResponse, searchQuery]);

  return {
    users,
    isLoading,
    error,
  };
}

/**
 * Client-side pagination utility for when backend doesn't support pagination
 * This is a fallback implementation mentioned in requirements
 */
export function useClientSidePagination<T>(
  items: T[],
  page: number,
  size: number
) {
  return useMemo(() => {
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedItems = items.slice(startIndex, endIndex);
    
    const totalPages = Math.ceil(items.length / size);
    
    return {
      content: paginatedItems,
      page: {
        number: page,
        size,
        totalElements: items.length,
        totalPages,
        first: page === 0,
        last: page >= totalPages - 1,
      },
    };
  }, [items, page, size]);
}
