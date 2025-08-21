import type { Category, Lesson, Page, Question, Section, Video } from '../courses';

export interface Instructor {
  id: string;
  name: string;
  email: string;
}

export interface ExtendedInstructor extends Instructor {
  avatar: string;
  bio: string;
  publishedCourses: number;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    x?: string;
  };
}

export interface LessonReview extends Lesson {
  video?: Video;
  quiz?: {
    questions: Question[];
  };
}

export interface SectionReview extends Section {
  order: number;
  totalVideoDuration: number;
  totalQuizQuestion: number;
}

export interface CourseReview {
  id: string;
  title: string;
  description: string;
  categories?: Category[];
  price?: number;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnailUrl?: string;
  createdBy: {
    id: string;
    name: string;
    email?: string;
  };
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  countSection: number;
  countLesson: number;
  totalDuration: number;
  statusUpdatedAt: string;
}

export interface CourseReviewDetail extends CourseReview {
  sections: SectionReview[];
}

export interface ApiCoursesReviewResponse {
  content: CourseReview[];
  page: Page;
}
