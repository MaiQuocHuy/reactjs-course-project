export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  thumbnailUrl?: string;
  bio?: string;
  isActive: boolean;
  enrolledCourses?: EnrolledCourse[];
  totalPayments?: number;
  totalStudyTimeSeconds?: number; // Study time in seconds
  // Optional fields for compatibility
  avatar?: string;
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface EnrolledCourse {
  courseId: string;
  courseTitle: string;
  instructorName: string;
  enrolledAt: string;
  completionStatus: CourseCompletionStatus;
  paidAmount: number;
  totalTimeStudying: number;
}

export type CourseCompletionStatus = 'IN_PROGRESS' | 'COMPLETED';

export type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

export type UserStatus = 'ACTIVE' | 'BANNED' | 'INACTIVE';

export interface Course {
  id: string;
  title: string;
  thumbnail?: string;
  price: number;
  enrolledAt: string;
  progress: number;
  status: CourseStatus;
}

export type CourseStatus = 'ENROLLED' | 'COMPLETED' | 'DROPPED';

export interface Payment {
  id: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
}

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface UserFilters {
  search: string;
  role: UserRole | 'ALL';
  status: UserStatus | 'ALL';
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}
