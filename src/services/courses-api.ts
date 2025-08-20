import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

import type { ApiResponse } from '@/types/common';
import type { ApiCoursesResponse, Section } from '@/types/courses';
import type {
  ApiCoursesReviewResponse,
  CourseReviewDetail,
} from '@/types/courses-review';

// Custom base query with retry and header preparation (mirrors usersApi pattern)
const baseQueryWithRetry = retry(
  fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACK_END_BASE_URL}/admin`,
    prepareHeaders: (headers) => {
      const token =
        'eyJhbGciOiJIUzM4NCJ9.eyJyb2xlcyI6WyJST0xFX0FETUlOIl0sInN1YiI6ImFsaWNlQGV4YW1wbGUuY29tIiwiaWF0IjoxNzU1NzEzMzM5LCJleHAiOjE3NTU3MTY5Mzl9.1BjZvRkPHlEod6LFvpXy-eKLcZ7a-3sQPzrV7pgUwRYnzbyaFBpa3HcT8IB5ShM2';
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      } else {
        if (process.env.NODE_ENV === 'development') {
          // Optionally set a mock token in development
          // headers.set('authorization', 'Bearer mock-token');
        }
      }
      headers.set('content-type', 'application/json');
      headers.set('accept', 'application/json');
      return headers;
    },
    credentials: 'include',
  }),
  {
    maxRetries: 2,
  }
);

export const coursesApi = createApi({
  reducerPath: 'coursesApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Courses', 'PendingCourses'],
  endpoints: (builder) => ({
    // Get all active courses
    getAllCourses: builder.query<
      ApiResponse<ApiCoursesResponse>,
      {
        page?: number;
        size?: number;
        sort?: string;
        minPrice?: number;
        maxPrice?: number;
        search?: string;
      }
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
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

        const queryString = searchParams.toString();
        return {
          url: `/courses${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.content.map((c) => ({
                type: 'Courses' as const,
                id: c.id,
              })),
              { type: 'Courses', id: 'LIST' },
            ]
          : [{ type: 'Courses', id: 'LIST' }],
    }),

    // Get course detail
    getCourseById: builder.query<ApiResponse<Section[]>, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, id) => [{ type: 'Courses', id }],
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
          url: `/courses/review-course${queryString ? `?${queryString}` : ''}`,
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
    getPendingCoursesById: builder.query<CourseReviewDetail, string>({
      query: (id) => ({
        url: `/courses/review-course/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        // console.log(response.data);
        return response.data;
      },
      providesTags: (result, error, id) => [{ type: 'PendingCourses', id }],
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
          url: `/courses/review-course/${id}`,
          method: 'PATCH',
          body: { status, ...(reason && { reason }) },
        };
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: 'PendingCourses', id: arg.id },
        { type: 'PendingCourses', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useGetPendingCoursesQuery,
  useGetPendingCoursesByIdQuery,
  useUpdateCourseStatusMutation,
} = coursesApi;
