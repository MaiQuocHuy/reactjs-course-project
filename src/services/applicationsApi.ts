import { createApi } from "@reduxjs/toolkit/query/react";
import type { Application, ApiResponse } from "../types/applications";
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
    
       // Parse documents JSON string
      // if (application.documents && typeof application.documents === 'string') {
      //  try {
      //      application.documents = JSON.parse(application.documents);
      //   } catch (error) {
      //    console.error('Failed to parse documents JSON:', error);
      //     application.documents = undefined;
      //   }
      //  }
       return application;
  },
      providesTags: (_result, _error, id) => [{ type: 'Application', id }],
    }),

  }),
});

export const {
  useGetApplicationsQuery,
  useGetApplicationByIdQuery,
} = applicationsApi;
