import { createApi } from "@reduxjs/toolkit/query/react";
import type { Application, ApiResponse, ReviewApplicationRequest } from "../types/applications";
import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';

export const applicationsApi = createApi({
  reducerPath: "applicationsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Application'],
  endpoints: (builder) => ({

    getApplications: builder.query<Application[], void>({
      query: () => "admin/applications",
      transformResponse: (response: ApiResponse<Application[]>) => response.data,
      providesTags: ['Application'],
    }),

    getApplicationsByUserId: builder.query<Application[], string>({
      query: (userId) => `admin/applications/${userId}`,
      transformResponse: (response: ApiResponse<Application[]>) => response.data,
      providesTags: (_result, _error, userId) => [{ type: 'Application', id: userId }],
    }),

    reviewApplication: builder.mutation<ApiResponse<void>, ReviewApplicationRequest>({
      query: ({ id, action, rejectionReason }) => ({
        url: `admin/applications/${id}/review`,
        method: "PATCH",
        body: { action, rejectionReason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Application',
        { type: 'Application', id }
      ],
    }),

    deleteApplication: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `admin/applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Application'],
    }),
  })
});

export const {
  useGetApplicationsQuery,
  useGetApplicationsByUserIdQuery,
  useReviewApplicationMutation,
  useDeleteApplicationMutation,
} = applicationsApi;
