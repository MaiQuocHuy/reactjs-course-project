export interface User {
  id: string;
  email: string;
  name: string;
  thumbnailUrl?: string;
  bio?: string;
  isActive: boolean;
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
}

export interface RefreshTokenResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
  };
  timestamp: string;
}