// Certificate types
export interface Certificate {
  id: string;
  certificateCode?: string;
  issuedAt?: string;
  userName?: string;
  userEmail?: string;
  courseTitle?: string;
  instructorName?: string;
  fileStatus: "GENERATED" | "PENDING";
  fileUrl?: string; // URL for downloading the certificate file
  
}

export interface CertificateDetail extends Certificate {
  userId?: string;
  courseId?: string;
  completedAt?: string;
  fileUrl?: string; // Alternative field name for certificate file URL
}

// Course types - reusing from existing types
export interface Course {
  id: string;
  title: string;
  instructor?: {
    name: string;
  } | string; // Support both object and string formats
  description?: string;
  createdAt?: string;
}

// User types - reusing from existing types  
export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
  avatar?: string;
}

// API response types
export interface PaginatedResponse<T> {
  content: T[];
  page: {
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
  };
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

// Filter and params types
export interface CertificateParams {
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface CertificateByCourseParams {
  courseId: string;
  page?: number;
  size?: number;
}

export interface CertificateByUserParams {
  userId: string;
  page?: number;
  size?: number;
}

// UI state types
export type FilterMode = "all" | "course" | "user";

export interface CertificateFilters {
  mode: FilterMode;
  search: string;
  selectedCourseId: string;
  selectedUserId: string;
  page: number;
  size: number;
}

// Hook return types
export interface UseCertificatesResult {
  certificates: Certificate[];
  isLoading: boolean;
  error: any;
  pagination?: PaginatedResponse<Certificate>['page'];
  refetch: () => void;
}

export interface UseCoursesResult {
  courses: Course[];
  isLoading: boolean;
  error: any;
}

export interface UseUsersResult {
  users: User[];
  isLoading: boolean;
  error: any;
}
