// Types for API responses
export interface PaymentUser {
  id: string;
  name: string;
  email: string;
  thumbnailUrl: string;
}

export interface PaymentCourse {
  id: string;
  title: string;
  thumbnailUrl: string;
}

export interface PaymentCourseDetail extends PaymentCourse {
  instructor: {
    id: string;
    name: string;
    email: string;
    thumbnailUrl: string;
  };
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  price: number;
}

export interface PaymentResponse {
  id: string;
  user: PaymentUser;
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  paymentMethod: string;
  createdAt: string;
  paidAt: string | null;
  paidOutAt: string | null;
  course: PaymentCourse;
}

export interface PaymentDetailResponse {
  id: string;
  user: PaymentUser;
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  paymentMethod: string;
  createdAt: string;
  paidAt: string | null;
  paidoutAt: string | null;
  updatedAt: string;
  transactionId: string | null;
  stripeSessionId: string | null;
  receiptUrl: string | null;
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
  course: PaymentCourseDetail;
}

export interface PaymentsApiResponse {
  statusCode: number;
  message: string;
  data: {
    content: PaymentResponse[];
    page: {
      number: number;
      size: number;
      totalPages: number;
      totalElements: number;
      first: boolean;
      last: boolean;
    };
  };
  timestamp: string;
}

export interface PaymentDetailApiResponse {
  statusCode: number;
  message: string;
  data: PaymentDetailResponse;
  timestamp: string;
}

export interface UpdatePaymentStatusRequest {
  status: "COMPLETED" | "FAILED";
}

export interface UpdatePaymentStatusResponse {
  statusCode: number;
  message: string;
  data: PaymentResponse;
  timestamp: string;
}

export interface PaidOutResponse {
  statusCode: number;
  message: string;
  data: {
    paymentId: string;
    courseId: string;
    courseTitle: string;
    instructorId: string;
    instructorName: string;
    amount: number;
    instructorEarning: number;
    paidOutAt: string;
    earningId: string;
  };
  timestamp: string;
}
// Payment user
export interface User {
  id: string;
  name: string;
  email: string;
  thumbnailUrl?: string;
  bio?: string;
  role?: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
}
// Course details
export interface Course {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  instructor: User;
  price?: number;
  isPublished?: boolean;
  isApproved?: boolean;
  thumbnailUrl?: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  user: User;
  course: Course;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  paymentMethod: "stripe" | "paypal";
  sessionId?: string;
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
