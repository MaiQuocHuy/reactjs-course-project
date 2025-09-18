export interface StudentSpendingData {
  id: string;
  name: string;
  email: string;
  totalSpent: string;
  coursesEnrolled: number;
  avatarUrl: string;
}

export interface TopSpenders {
  topStudents: StudentSpendingData[];
  limit: number;
}