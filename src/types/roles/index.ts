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
  key: string; // Backend uses 'key' instead of 'id'
  description: string;
  resource: {
    key: string;
    name: string;
    isActive: boolean;
  };
  action: {
    key: string;
    name: string;
    isActive: boolean;
  };
  isActive: boolean;
  roleActive: boolean | null;
  permissionActive: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoleWithPermissions {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleCreateRequest {
  name: string;
  description: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface RoleUpdateRequest {
  name?: string;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface AssignPermissionsRequest {
  permissionIds: string[];
}

export interface RolePageResponse {
  content: Role[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface RoleQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  name?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface RoleFilters {
  search: string;
  status: 'ALL' | 'ACTIVE' | 'INACTIVE';
}
