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
