import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';
import type { UserPermissions, UserRole } from '@/types/auth';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PermissionCheckResponse {
  hasPermission: boolean;
}

export const permissionsApi = createApi({
  reducerPath: 'permissionsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['UserPermissions', 'UserRole'],
  endpoints: (builder) => ({
    // Get current user's permissions
    getUserPermissions: builder.query<ApiResponse<UserPermissions>, void>({
      query: () => ({
        url: '/auth/permissions',
        method: 'GET',
      }),
      providesTags: ['UserPermissions'],
    }),

    // Check if user has specific permission
    checkPermission: builder.query<ApiResponse<boolean>, string>({
      query: (permissionKey) => ({
        url: `/auth/permissions/check`,
        method: 'GET',
        params: { permissionKey },
      }),
      providesTags: ['UserPermissions'],
    }),

    // Get current user's role
    getUserRole: builder.query<ApiResponse<UserRole>, void>({
      query: () => ({
        url: '/auth/role',
        method: 'GET',
      }),
      providesTags: ['UserRole'],
    }),

    // Assign role to user (Admin only)
    assignUserRole: builder.mutation<
      ApiResponse<void>,
      { userId: string; roleId: string }
    >({
      query: ({ userId, roleId }) => ({
        url: `/admin/users/${userId}/role`,
        method: 'PUT',
        body: { roleId },
      }),
      invalidatesTags: ['UserPermissions', 'UserRole'],
    }),
  }),
});

export const {
  useGetUserPermissionsQuery,
  useCheckPermissionQuery,
  useGetUserRoleQuery,
  useAssignUserRoleMutation,
  useLazyCheckPermissionQuery,
  useLazyGetUserPermissionsQuery,
} = permissionsApi;
