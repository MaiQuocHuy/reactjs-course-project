import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';

// Role interfaces based on backend structure
export interface Role {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  permissionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  permissionKey: string;
  description: string;
  resource: {
    id: string;
    name: string;
    description: string;
  };
  action: {
    id: string;
    name: string;
    actionType: string;
  };
}

export interface RoleWithPermissions {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  permissions: Permission[];
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
}

export interface UpdateRoleRequest {
  name: string;
  description?: string;
}

export interface AssignPermissionsRequest {
  permissionIds: string[];
}

export interface RolePageResponse {
  content: Role[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

// Query parameters for role list
export interface RoleQueryParams {
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Role', 'Permission'],
  endpoints: (builder) => ({
    // Get roles with pagination
    getRoles: builder.query<ApiResponse<RolePageResponse>, RoleQueryParams>({
      query: ({ search, page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
          sortBy,
          sortDir,
        });
        
        if (search) {
          params.append('search', search);
        }

        return `/permissions/roles?${params.toString()}`;
      },
      providesTags: ['Role'],
    }),

    // Get role by ID with permissions (temporarily disabled)
    // getRoleById: builder.query<ApiResponse<Role>, string>({
    //   query: (id) => `/permissions/roles?search=${id}&size=1`, // Use roles endpoint with search
    //   providesTags: (_result, _error, id) => [{ type: 'Role', id }],
    //   transformResponse: (response: ApiResponse<RolePageResponse>, _meta, arg) => {
    //     // Find the role in the paginated response
    //     const role = response.data?.content?.find(r => r.id === arg);
    //     if (role) {
    //       return {
    //         ...response,
    //         data: role
    //       };
    //     }
    //     throw new Error('Role not found');
    //   },
    // }),

    // Get all available permissions
    getAllPermissions: builder.query<ApiResponse<Permission[]>, void>({
      query: () => '/permissions',
      providesTags: ['Permission'],
    }),

    // Create new role
    createRole: builder.mutation<ApiResponse<Role>, CreateRoleRequest>({
      query: (body) => ({
        url: '/permissions/roles',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Role'],
    }),

    // Update role (NOT IMPLEMENTED IN BACKEND YET)
    // updateRole: builder.mutation<ApiResponse<Role>, { id: string; data: UpdateRoleRequest }>({
    //   query: ({ id, data }) => ({
    //     url: `/permissions/roles/${id}`,
    //     method: 'PUT',
    //     body: data,
    //   }),
    //   invalidatesTags: (_result, _error, { id }) => [{ type: 'Role', id }, 'Role'],
    // }),

    // Delete role (NOT IMPLEMENTED IN BACKEND YET)
    // deleteRole: builder.mutation<ApiResponse<void>, string>({
    //   query: (id) => ({
    //     url: `/permissions/roles/${id}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['Role'],
    // }),

    // Assign permissions to role
    assignPermissions: builder.mutation<ApiResponse<RoleWithPermissions>, { id: string; data: AssignPermissionsRequest }>({
      query: ({ id, data }) => ({
        url: `/permissions/roles/${id}/permissions`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Role', id }, 'Role'],
    }),
  }),
});

export const {
  useGetRolesQuery,
  // useGetRoleByIdQuery,
  useGetAllPermissionsQuery,
  useCreateRoleMutation,
  // useUpdateRoleMutation, // Not implemented yet
  // useDeleteRoleMutation, // Not implemented yet
  useAssignPermissionsMutation,
} = rolesApi;
