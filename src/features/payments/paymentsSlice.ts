import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Payment, User, Course } from "@/types/payments";

interface PaymentsState {
  payments: Payment[];
  filteredPayments: Payment[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: "ALL" | "PENDING" | "COMPLETED" | "FAILED";
  paymentMethodFilter: "ALL" | "stripe" | "paypal";
  dateRange: {
    from: string | null;
    to: string | null;
  };
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

// Mock users
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    role: { id: "1", role: "STUDENT" },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    role: { id: "2", role: "STUDENT" },
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    role: { id: "3", role: "STUDENT" },
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05"),
  },
  {
    id: "4",
    name: "Bob Wilson",
    email: "bob.wilson@example.com",
    thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    role: { id: "4", role: "STUDENT" },
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "5",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    role: { id: "5", role: "STUDENT" },
    createdAt: new Date("2024-02-25"),
    updatedAt: new Date("2024-02-25"),
  },
];

// Mock instructor
const mockInstructor: User = {
  id: "instructor-1",
  name: "Dr. Michael Brown",
  email: "michael.brown@example.com",
  thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  role: { id: "instructor-role", role: "INSTRUCTOR" },
  createdAt: new Date("2023-06-01"),
  updatedAt: new Date("2023-06-01"),
};

// Mock courses
const mockCourses: Course[] = [
  {
    id: "1",
    title: "React Fundamentals",
    slug: "react-fundamentals",
    description: "Learn the basics of React development",
    instructor: mockInstructor,
    price: 99.99,
    isPublished: true,
    isApproved: true,
    thumbnailUrl: "https://via.placeholder.com/300x200?text=React+Course",
    level: "BEGINNER",
    isDeleted: false,
    createdAt: new Date("2023-08-01"),
    updatedAt: new Date("2023-08-01"),
  },
  {
    id: "2",
    title: "Advanced TypeScript",
    slug: "advanced-typescript",
    description: "Master TypeScript for professional development",
    instructor: mockInstructor,
    price: 149.99,
    isPublished: true,
    isApproved: true,
    thumbnailUrl: "https://via.placeholder.com/300x200?text=TypeScript+Course",
    level: "ADVANCED",
    isDeleted: false,
    createdAt: new Date("2023-09-01"),
    updatedAt: new Date("2023-09-01"),
  },
  {
    id: "3",
    title: "Node.js Backend Development",
    slug: "nodejs-backend",
    description: "Build scalable backend applications with Node.js",
    instructor: mockInstructor,
    price: 199.99,
    isPublished: true,
    isApproved: true,
    thumbnailUrl: "https://via.placeholder.com/300x200?text=Node.js+Course",
    level: "INTERMEDIATE",
    isDeleted: false,
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2023-10-01"),
  },
  {
    id: "4",
    title: "Full Stack Development",
    slug: "full-stack-dev",
    description: "Complete full stack development course",
    instructor: mockInstructor,
    price: 299.99,
    isPublished: true,
    isApproved: true,
    thumbnailUrl: "https://via.placeholder.com/300x200?text=Full+Stack+Course",
    level: "ADVANCED",
    isDeleted: false,
    createdAt: new Date("2023-11-01"),
    updatedAt: new Date("2023-11-01"),
  },
  {
    id: "5",
    title: "JavaScript Essentials",
    slug: "javascript-essentials",
    description: "Master JavaScript fundamentals",
    instructor: mockInstructor,
    price: 79.99,
    isPublished: true,
    isApproved: true,
    thumbnailUrl: "https://via.placeholder.com/300x200?text=JavaScript+Course",
    level: "BEGINNER",
    isDeleted: false,
    createdAt: new Date("2023-07-01"),
    updatedAt: new Date("2023-07-01"),
  },
];

// Generate mock payments
const generateMockPayments = (): Payment[] => {
  const payments: Payment[] = [];
  const statuses: Payment["status"][] = ["PENDING", "COMPLETED", "FAILED"];
  const paymentMethods: Payment["paymentMethod"][] = ["stripe", "paypal"];

  for (let i = 1; i <= 25; i++) {
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const course = mockCourses[Math.floor(Math.random() * mockCourses.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const paymentMethod =
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

    const createdAt = new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );
    const paidAt =
      status === "COMPLETED"
        ? new Date(createdAt.getTime() + Math.random() * 86400000)
        : undefined;

    payments.push({
      id: i.toString(),
      user,
      course,
      amount: course.price || 0,
      status,
      paymentMethod,
      sessionId: `sess_${Math.random().toString(36).substr(2, 9)}`,
      paidAt,
      createdAt,
      updatedAt: createdAt,
    });
  }

  return payments.sort(
    (a, b) =>
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  );
};

const initialState: PaymentsState = {
  payments: generateMockPayments(),
  filteredPayments: [],
  loading: false,
  error: null,
  searchQuery: "",
  statusFilter: "ALL",
  paymentMethodFilter: "ALL",
  dateRange: {
    from: null,
    to: null,
  },
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 1,
};

const applyFilters = (state: PaymentsState) => {
  let filtered = [...state.payments];

  // Apply search filter
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (payment) =>
        payment.user.name.toLowerCase().includes(query) ||
        payment.course.title.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (state.statusFilter !== "ALL") {
    filtered = filtered.filter(
      (payment) => payment.status === state.statusFilter
    );
  }

  // Apply payment method filter
  if (state.paymentMethodFilter !== "ALL") {
    filtered = filtered.filter(
      (payment) => payment.paymentMethod === state.paymentMethodFilter
    );
  }

  // Apply date range filter
  if (state.dateRange.from && state.dateRange.to) {
    const fromDate = new Date(state.dateRange.from);
    const toDate = new Date(state.dateRange.to);
    filtered = filtered.filter((payment) => {
      if (!payment.createdAt) return false;
      const paymentDate = new Date(payment.createdAt);
      return paymentDate >= fromDate && paymentDate <= toDate;
    });
  }

  state.filteredPayments = filtered;
  state.totalPages = Math.ceil(filtered.length / state.itemsPerPage);

  // Reset to first page if current page is out of bounds
  if (state.currentPage > state.totalPages && state.totalPages > 0) {
    state.currentPage = 1;
  }
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
      applyFilters(state);
    },
    setStatusFilter: (
      state,
      action: PayloadAction<PaymentsState["statusFilter"]>
    ) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
      applyFilters(state);
    },
    setPaymentMethodFilter: (
      state,
      action: PayloadAction<PaymentsState["paymentMethodFilter"]>
    ) => {
      state.paymentMethodFilter = action.payload;
      state.currentPage = 1;
      applyFilters(state);
    },
    setDateRange: (
      state,
      action: PayloadAction<{ from: string | null; to: string | null }>
    ) => {
      state.dateRange = action.payload;
      state.currentPage = 1;
      applyFilters(state);
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
      applyFilters(state);
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.statusFilter = "ALL";
      state.paymentMethodFilter = "ALL";
      state.dateRange = { from: null, to: null };
      state.currentPage = 1;
      applyFilters(state);
    },
    initializeFilters: (state) => {
      applyFilters(state);
    },
  },
});

export const {
  setLoading,
  setError,
  setSearchQuery,
  setStatusFilter,
  setPaymentMethodFilter,
  setDateRange,
  setCurrentPage,
  setItemsPerPage,
  clearFilters,
  initializeFilters,
} = paymentsSlice.actions;

export default paymentsSlice;
