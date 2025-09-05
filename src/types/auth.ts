export interface User {
  id: string;
  email: string;
  name: string;
  thumbnailUrl?: string;
  bio?: string;
  isActive: boolean;
  role?: string; // Add role field
}

export interface UserRole {
  id: string;
  name: string;
}

export interface PermissionDetail {
  permissionKey: string;
  description: string;
  resource: string;
  action: string;
  filterType: string;
  canAccessAll: boolean;
  canAccessOwn: boolean;
}

export interface UserPermissions {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  detailedPermissions: PermissionDetail[];
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
  timestamp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: string[]; // Add permissions to auth state
  userRole: UserRole | null; // Add user role to auth state
}

export interface RefreshTokenResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
  };
  timestamp: string;
}