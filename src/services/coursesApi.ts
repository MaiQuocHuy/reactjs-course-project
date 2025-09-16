import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';
import type { ApiResponse, PaginatedResponse } from '@/types/common';
import type {
  ApiCoursesResponse,
  Course,
  CourseFilters,
  Section,
} from '@/types/courses';
import type {
  ApiCoursesReviewResponse,
  CourseReviewDetail,
} from '@/types/courses-review';

// Price range metadata type
export interface PriceRangeMetadata {
  minPrice: number;
  maxPrice: number;
}

export const coursesApi = createApi({
  reducerPath: 'coursesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Courses', 'PendingCourses'],
  endpoints: (builder) => ({
    // Get all active courses
    getAllCourses: builder.query<ApiCoursesResponse, CourseFilters>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        // Default to active courses, but allow override
        const status =
          params.status === undefined ? 'true' : String(params.status);
        searchParams.append('status', status);
        if (params.page !== undefined)
          searchParams.append('page', String(params.page));
        if (params.size !== undefined)
          searchParams.append('size', String(params.size));
        if (params.sort) searchParams.append('sort', params.sort);
        if (params.minPrice !== undefined)
          searchParams.append('minPrice', String(params.minPrice));
        if (params.maxPrice !== undefined)
          searchParams.append('maxPrice', String(params.maxPrice));
        if (params.search) searchParams.append('search', params.search);
        if (params.categoryId)
          searchParams.append('categoryId', params.categoryId);
        if (params.level) searchParams.append('level', params.level);
        if (params.averageRating !== undefined)
          searchParams.append('averageRating', String(params.averageRating));

        const queryString = searchParams.toString();
        return {
          url: `/admin/courses${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      transformResponse: (response: ApiResponse<PaginatedResponse<Course>>) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((c) => ({
                type: 'Courses' as const,
                id: c.id,
              })),
              { type: 'Courses', id: 'LIST' },
            ]
          : [{ type: 'Courses', id: 'LIST' }],
    }),

    // Get course detail
    getCourseById: builder.query<Section[], string | undefined>({
      query: (id) => {
        if (!id) {
          throw new Error('Course ID is required');
        } else {
          return {
            url: `/admin/courses/${id}`,
            method: 'GET',
          };
        }
      },
      transformResponse: (response: any) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Courses', id }],
    }),

    // Get pending / resubmit courses
    getPendingCourses: builder.query<
      ApiCoursesReviewResponse,
      {
        status?: string;
        createdBy?: string;
        dateFrom?: string;
        dateTo?: string;
        page?: number;
        size?: number;
        sort?: string;
      }
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.status !== undefined)
          searchParams.append('status', params.status);
        if (params.createdBy !== undefined)
          searchParams.append('createdBy', params.createdBy);
        if (params.dateFrom !== undefined)
          searchParams.append('dateFrom', params.dateFrom);
        if (params.dateTo !== undefined)
          searchParams.append('dateTo', params.dateTo);
        if (params.page !== undefined)
          searchParams.append('page', String(params.page));
        if (params.size !== undefined)
          searchParams.append('size', String(params.size));
        if (params.sort !== undefined) searchParams.append('sort', params.sort);

        const queryString = searchParams.toString();
        return {
          url: `/admin/courses/review-course${
            queryString ? `?${queryString}` : ''
          }`,
          method: 'GET',
        };
      },
      transformResponse: (response: any) => {
        // console.log(response.data);
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((c) => ({
                type: 'PendingCourses' as const,
                id: c.id,
              })),
              { type: 'PendingCourses', id: 'LIST' },
            ]
          : [{ type: 'PendingCourses', id: 'LIST' }],
    }),

    // Get course detail
    getPendingCoursesById: builder.query<
      CourseReviewDetail,
      string | undefined
    >({
      query: (id) => {
        if (!id) {
          throw new Error('Course ID is required');
        } else {
          return {
            url: `/admin/courses/review-course/${id}`,
            method: 'GET',
          };
        }
      },
      transformResponse: (response: any) => {
        // console.log(response.data);
        return response.data;
      },
      providesTags: (_result, _error, id) => [{ type: 'PendingCourses', id }],
    }),

    // Update course status (accept or reject)
    updateCourseStatus: builder.mutation<
      void,
      { id: string; status: 'APPROVED' | 'REJECTED'; reason?: string }
    >({
      query: ({ id, status, reason }) => {
        // Validate that reason is provided when status is REJECTED
        if (status === 'REJECTED' && !reason) {
          throw new Error('Reason is required when rejecting a course');
        }

        return {
          url: `/admin/courses/review-course/${id}`,
          method: 'PATCH',
          body: { status, ...(reason && { reason }) },
        };
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: 'PendingCourses', id: arg.id },
        { type: 'PendingCourses', id: 'LIST' },
      ],
    }),

    // Get min and max price for course filters
    getMinAndMaxPrice: builder.query<PriceRangeMetadata, void>({
      query: () => ({
        url: '/admin/courses/filter-metadata',
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<PriceRangeMetadata>) =>
        response.data,
    }),
  }),
});

export const {
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useGetPendingCoursesQuery,
  useGetPendingCoursesByIdQuery,
  useUpdateCourseStatusMutation,
  useGetMinAndMaxPriceQuery,
} = coursesApi;
