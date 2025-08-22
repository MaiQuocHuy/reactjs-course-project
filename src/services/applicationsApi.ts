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

    getApplicationById: builder.query<Application, string>({
      query: (id) => `admin/applications/${id}`,
      transformResponse: (response: ApiResponse<Application>) => {
        const application = response.data;
    
       return application;
  },
      providesTags: (_result, _error, id) => [{ type: 'Application', id }],
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
  })
});

export const {
  useGetApplicationsQuery,
  useGetApplicationByIdQuery,
  useReviewApplicationMutation,
} = applicationsApi;
