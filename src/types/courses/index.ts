export interface Instructor {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  instructor: Instructor;
  isApproved: boolean;
  isPublished: boolean;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  price: number;
  enrollmentCount: number;
  averageRating: number;
  ratingCount: number;
  sectionCount: number;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  url: string;
  duration: number;
  title: string | null;
  thumbnail: string | null;
}

export interface Question {
  id: string;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'VIDEO' | 'QUIZ';
  order: number;
  video?: Video;
  quiz?: {
    questions: Question[];
  };
}

export interface Section {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  lessonCount: number;
  lessons: Lesson[];
}

export interface Page {
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

export interface ApiCoursesResponse {
  content: Course[];
  page: Page;
}

export interface CourseFilters {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
  categoryId?: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  minPrice?: number;
  maxPrice?: number;
  averageRating?: number;
  status?: boolean;
}
