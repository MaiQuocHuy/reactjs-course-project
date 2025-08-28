import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';

// Role interfaces based on backend structure
export interface Role {
  id: string;
  name: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export interface RolePermissionDetail {
  id: string;
  permission: Permission;
  isActive: boolean;
  filterType?: string;
}

// Interface for permissions response from /api/permissions/{roleId}
export interface PermissionsByResource {
  [resourceName: string]: Permission[];
}

export interface RolePermissionsData {
  roleId: string;
  roleName: string;
  resources: PermissionsByResource;
}

export interface RolePermissionsResponse {
  statusCode: number;
  message: string;
  data: RolePermissionsData;
  timestamp: string;
}

export interface RoleWithPermissions {
  id: string;
  name: string;
  permissions: RolePermissionDetail[];
  totalPermission?: number;
  totalUsers?: number;
}

export interface CreateRoleRequest {
  name: string;
}

export interface UpdateRoleRequest {
  name: string;
}

export interface AssignPermissionsRequest {
  permissionIds: string[];
}

export interface RemovePermissionsRequest {
  permissionIds: string[];
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Role', 'Permission'],
  endpoints: (builder) => ({
    // Get paginated roles with permissions
    getRoles: builder.query<
      ApiResponse<PaginatedResponse<RoleWithPermissions>>,
      { page?: number; size?: number }
    >({
      query: ({ page = 0, size = 10 }) => `/admin/roles?page=${page}&size=${size}`,
      providesTags: ['Role'],
    }),

    // Get simple roles list (for dropdowns)
    getRolesList: builder.query<ApiResponse<Role[]>, void>({
      query: () => '/admin/roles/list',
      providesTags: ['Role'],
    }),

    // Get role by ID
    getRoleById: builder.query<ApiResponse<RoleWithPermissions>, string>({
      query: (roleId: string) => `/admin/roles/${roleId}`,
      providesTags: (_result, _error, roleId) => [{ type: 'Role', id: roleId }],
    }),

    // Create new role
    createRole: builder.mutation<ApiResponse<Role>, CreateRoleRequest>({
      query: (data: CreateRoleRequest) => ({
        url: '/admin/roles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Role'],
    }),

    // Update role
    updateRole: builder.mutation<
      ApiResponse<Role>,
      { roleId: string; data: UpdateRoleRequest }
    >({
      query: ({ roleId, data }: { roleId: string; data: UpdateRoleRequest }) => ({
        url: `/admin/roles/${roleId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { roleId }) => [
        { type: 'Role', id: roleId },
        'Role',
      ],
    }),

    // Delete role
    deleteRole: builder.mutation<ApiResponse<void>, string>({
      query: (roleId: string) => ({
        url: `/admin/roles/${roleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role'],
    }),

    // Assign permissions to role
    assignPermissions: builder.mutation<
      ApiResponse<void>,
      { roleId: string; data: AssignPermissionsRequest }
    >({
      query: ({ roleId, data }: { roleId: string; data: AssignPermissionsRequest }) => ({
        url: `/admin/roles/${roleId}/permissions`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { roleId }) => [
        { type: 'Role', id: roleId },
        'Role',
      ],
    }),

    // Remove permissions from role
    removePermissions: builder.mutation<
      ApiResponse<void>,
      { roleId: string; data: RemovePermissionsRequest }
    >({
      query: ({ roleId, data }: { roleId: string; data: RemovePermissionsRequest }) => ({
        url: `/admin/roles/${roleId}/permissions`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: (_result, _error, { roleId }) => [
        { type: 'Role', id: roleId },
        'Role',
      ],
    }),

    // Get available permissions
    getAvailablePermissions: builder.query<ApiResponse<Permission[]>, void>({
      query: () => '/admin/roles/permissions/available',
      providesTags: ['Permission'],
    }),

    // Get role permissions using correct endpoint
    getRolePermissions: builder.query<
      RolePermissionsResponse,
      string
    >({
      query: (roleId: string) => `/permissions/${roleId}`,
      providesTags: (_result, _error, roleId) => [{ type: 'Role', id: roleId }],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRolesListQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignPermissionsMutation,
  useRemovePermissionsMutation,
  useGetAvailablePermissionsQuery,
  useGetRolePermissionsQuery,
} = rolesApi;
