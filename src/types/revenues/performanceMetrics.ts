export interface CategoryRevenue {
  category: string;
  revenue: number;
  studentsCount: number;
  coursesCount: number;
  percentage: number;
}

export interface InstructorPerformance {
  id: string;
  name: string;
  email: string;
  coursesCount: number;
  totalRevenue: number;
  averageRating: number;
  totalStudents: number;
}

export interface PerformanceMetrics {
  categoryRevenues: CategoryRevenue[];
  revenueByCategory: Record<string, string>;
  topInstructors: InstructorPerformance[];
  topPerformingCategory: string;
  worstPerformingCategory: string;
  // averageRevenuePerUser: string;
  // totalActiveUsers: number;
}