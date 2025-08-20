// src/services/usersApi.ts
import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import type { User } from "../types/users";

// Custom base query with retry logic
const baseQueryWithRetry = retry(
  fetchBaseQuery({ 
    baseUrl: "http://localhost:8080/api/admin/v1",
    prepareHeaders: (headers) => {
      // Add authorization header if token exists
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      } else {
        // For development, add a mock authorization or skip auth
        if (process.env.NODE_ENV === 'development') {
          console.warn('Development mode: No auth token found. Using mock auth.');
          // You can add a mock token here for development
          // headers.set('authorization', 'Bearer mock-token');
        }
      }
      headers.set('content-type', 'application/json');
      headers.set('accept', 'application/json');
      return headers;
    },
    // Handle credentials for CORS
    credentials: 'include',
  }),
  {
    maxRetries: 2,
  }
);

// API Response types based on Spring Boot backend
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface AdminUserPageResponse {
  users: User[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "INSTRUCTOR" | "STUDENT";
  bio?: string;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  name: string;
  bio?: string;
}

export interface UpdateUserRoleRequest {
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
}

export interface UpdateUserStatusRequest {
  isActive: boolean;
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // GET /api/admin/v1/users - Get users with pagination and filters
    getUsers: builder.query<
      ApiResponse<AdminUserPageResponse>,
      {
        search?: string;
        role?: string;
        isActive?: boolean;
        page?: number;
        size?: number;
        sort?: string;
      }
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        
        if (params.search) searchParams.append('search', params.search);
        if (params.role && params.role !== 'ALL') searchParams.append('role', params.role);
        if (params.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
        if (params.page !== undefined) searchParams.append('page', params.page.toString());
        if (params.size !== undefined) searchParams.append('size', params.size.toString());
        if (params.sort) searchParams.append('sort', params.sort);

        const queryString = searchParams.toString();
        return {
          url: `/users${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
    }),

    // GET /api/admin/v1/users/{id} - Get user by ID
    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
    }),

    // POST /api/admin/v1/users - Create new user
    createUser: builder.mutation<ApiResponse<User>, CreateUserRequest>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
    }),

    // PUT /api/admin/v1/users/{id} - Update user profile
    updateUser: builder.mutation<
      ApiResponse<User>,
      { id: string; data: UpdateUserRequest }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // PATCH /api/admin/v1/users/{id}/role - Update user role
    updateUserRole: builder.mutation<
      ApiResponse<User>,
      { id: string; data: UpdateUserRoleRequest }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
        body: data,
      }),
    }),

    // PATCH /api/admin/v1/users/{id}/status - Update user status (ban/unban)
    updateUserStatus: builder.mutation<
      ApiResponse<User>,
      { id: string; data: UpdateUserStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}/status`,
        method: 'PATCH',
        body: data,
      }),
    }),

    // DELETE /api/admin/v1/users/{id} - Delete user
    deleteUser: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
} = usersApi;
