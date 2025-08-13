// Payment user
export interface User {
  id: string;
  name: string;
  email: string;
  thumbnailUrl?: string;
  bio?: string;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Payment {
  id: string;
  user: User;
  course: Course;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  paymentMethod: "stripe" | "paypal";
  sessionId?: string;
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
