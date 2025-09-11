import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';
import type {
  Certificate,
  CertificateDetail,
  PaginatedResponse,
  ApiResponse,
  CertificateParams,
  CertificateByCourseParams,
  CertificateByUserParams,
} from '@/types/certificates';

export const certificatesApi = createApi({
  reducerPath: 'certificatesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Certificates', 'Courses', 'Users'],
  endpoints: (builder) => ({
    // Get all certificates with search and pagination
    getCertificates: builder.query<PaginatedResponse<Certificate>, CertificateParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams({
          page: String(params.page || 0),
          size: String(params.size || 10),
          sort: params.sort || 'issuedAt,desc'
        });
        
        if (params.search) {
          searchParams.append('search', params.search);
        }
        
        return {
          url: `/certificates?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      transformResponse: (response: ApiResponse<PaginatedResponse<Certificate>>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Certificates' as const, id })),
              { type: 'Certificates', id: 'LIST' },
            ]
          : [{ type: 'Certificates', id: 'LIST' }],
    }),

    // Get certificates by course
    getCertificatesByCourse: builder.query<PaginatedResponse<Certificate>, CertificateByCourseParams>({
      query: ({ courseId, page = 0, size = 10 }) => {
        const searchParams = new URLSearchParams({
          page: String(page),
          size: String(size),
        });
        
        return {
          url: `/certificates/course/${courseId}?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      transformResponse: (response: ApiResponse<PaginatedResponse<Certificate>>) => {
        // Fallback: if backend doesn't support pagination, create paginated response
        if (!response.data.page) {
          const content = Array.isArray(response.data) ? response.data : response.data.content || [];
          return {
            content,
            page: {
              number: 0,
              size: content.length,
              totalElements: content.length,
              totalPages: 1,
              first: true,
              last: true,
            },
          };
        }
        return response.data;
      },
      providesTags: (_result, _error, { courseId }) => [
        { type: 'Certificates', id: `course-${courseId}` },
      ],
    }),

    // Get certificates by user
    getCertificatesByUser: builder.query<PaginatedResponse<Certificate>, CertificateByUserParams>({
      query: ({ userId, page = 0, size = 10 }) => {
        const searchParams = new URLSearchParams({
          page: String(page),
          size: String(size),
        });
        
        return {
          url: `/certificates/user/${userId}?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      transformResponse: (response: ApiResponse<PaginatedResponse<Certificate>>) => {
        // Fallback: if backend doesn't support pagination, create paginated response
        if (!response.data.page) {
          const content = Array.isArray(response.data) ? response.data : response.data.content || [];
          return {
            content,
            page: {
              number: 0,
              size: content.length,
              totalElements: content.length,
              totalPages: 1,
              first: true,
              last: true,
            },
          };
        }
        return response.data;
      },
      providesTags: (_result, _error, { userId }) => [
        { type: 'Certificates', id: `user-${userId}` },
      ],
    }),

    // Get certificate by ID
    getCertificateById: builder.query<CertificateDetail, string>({
      query: (id) => ({
        url: `/certificates/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<CertificateDetail>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Certificates', id }],
    }),
  }),
});

export const {
  useGetCertificatesQuery,
  useGetCertificatesByCourseQuery,
  useGetCertificatesByUserQuery,
  useGetCertificateByIdQuery,
} = certificatesApi;

// Legacy exports for backward compatibility
export const useGetAllCertificatesQuery = useGetCertificatesQuery;
export type { Certificate } from '@/types/certificates';
