// src/services/usersApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import type { User } from "../types/users";
import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';

// API Response types based on Spring Boot backend
export interface ApiResponse<T> {
  statusCode: number; 
  message: string;
  data: T;
  timestamp?: string; 
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
  baseQuery: baseQueryWithReauth,
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
          url: `/admin/users${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
    }),

    // GET /api/admin/users/{id} - Get user by ID
    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'GET',
      }),
    }),

    // POST /api/admin/users - Create new user
    createUser: builder.mutation<ApiResponse<User>, CreateUserRequest>({
      query: (body) => ({
        url: '/admin/users',
        method: 'POST',
        body,
      }),
    }),

    // PUT /api/admin/users/{id} - Update user profile
    updateUser: builder.mutation<
      ApiResponse<User>,
      { id: string; data: UpdateUserRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // PATCH /api/admin/users/{id}/role - Update user role
    updateUserRole: builder.mutation<
      ApiResponse<User>,
      { id: string; data: UpdateUserRoleRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PATCH',
        body: data,
      }),
    }),

    // PATCH /api/admin/users/{id}/status - Update user status (ban/unban)
    updateUserStatus: builder.mutation<
      ApiResponse<User>,
      { id: string; data: UpdateUserStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}/status`,
        method: 'PUT',
        body: data,
      }),
    }),

    // DELETE /api/admin/users/{id} - Delete user
    deleteUser: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
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
