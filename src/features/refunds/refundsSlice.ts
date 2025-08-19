import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Refund } from "@/types/refunds";
import type { Payment, User, Course } from "@/types/payments";

interface RefundsState {
  refunds: Refund[];
  filteredRefunds: Refund[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: "ALL" | "PENDING" | "COMPLETED" | "FAILED";
  dateRange: {
    from: string | null;
    to: string | null;
  };
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

// Mock users (reuse from payments)
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    role: { id: "1", role: "STUDENT" },
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    role: { id: "2", role: "STUDENT" },
    createdAt: "2024-02-10T00:00:00.000Z",
    updatedAt: "2024-02-10T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    role: { id: "3", role: "STUDENT" },
    createdAt: "2024-03-05T00:00:00.000Z",
    updatedAt: "2024-03-05T00:00:00.000Z",
  },
  {
    id: "4",
    name: "Bob Wilson",
    email: "bob.wilson@example.com",
    thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    role: { id: "4", role: "STUDENT" },
    createdAt: "2024-01-20T00:00:00.000Z",
    updatedAt: "2024-01-20T00:00:00.000Z",
  },
  {
    id: "5",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    role: { id: "5", role: "STUDENT" },
    createdAt: "2024-02-25T00:00:00.000Z",
    updatedAt: "2024-02-25T00:00:00.000Z",
  },
];

// Mock instructor
const mockInstructor: User = {
  id: "instructor-1",
  name: "Dr. Michael Brown",
  email: "michael.brown@example.com",
  thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  role: { id: "instructor-role", role: "INSTRUCTOR" },
  createdAt: "2023-06-01T00:00:00.000Z",
  updatedAt: "2023-06-01T00:00:00.000Z",
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
    createdAt: "2023-08-01T00:00:00.000Z",
    updatedAt: "2023-08-01T00:00:00.000Z",
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
    createdAt: "2023-09-01T00:00:00.000Z",
    updatedAt: "2023-09-01T00:00:00.000Z",
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
    createdAt: "2023-10-01T00:00:00.000Z",
    updatedAt: "2023-10-01T00:00:00.000Z",
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
    createdAt: "2023-11-01T00:00:00.000Z",
    updatedAt: "2023-11-01T00:00:00.000Z",
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
    createdAt: "2023-07-01T00:00:00.000Z",
    updatedAt: "2023-07-01T00:00:00.000Z",
  },
];

// Generate mock payments for refunds
const generateMockPayments = (): Payment[] => {
  const payments: Payment[] = [];
  const paymentMethods: Payment["paymentMethod"][] = ["stripe", "paypal"];

  for (let i = 1; i <= 15; i++) {
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const course = mockCourses[Math.floor(Math.random() * mockCourses.length)];
    const paymentMethod =
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

    const createdAtDate = new Date(
      2024,
      Math.floor(Math.random() * 6), // First 6 months to allow for refunds
      Math.floor(Math.random() * 28) + 1
    );
    const createdAt = createdAtDate.toISOString();
    const paidAt = new Date(
      createdAtDate.getTime() + Math.random() * 86400000
    ).toISOString();

    payments.push({
      id: `payment-${i}`,
      user,
      course,
      amount: course.price || 0,
      status: "COMPLETED",
      paymentMethod,
      sessionId: `sess_${Math.random().toString(36).substr(2, 9)}`,
      paidAt,
      createdAt,
      updatedAt: createdAt,
    });
  }

  return payments;
};

// Generate mock refunds
const generateMockRefunds = (): Refund[] => {
  const mockPayments = generateMockPayments();
  const refunds: Refund[] = [];
  const statuses: Refund["status"][] = ["PENDING", "COMPLETED", "FAILED"];
  const reasons = [
    "Course content not as expected",
    "Technical issues with course access",
    "Duplicate purchase",
    "Changed my mind within 30 days",
    "Quality issues with course material",
    "Course was cancelled by instructor",
    "Payment error - duplicate charge",
    "Course difficulty not suitable",
    "Personal circumstances changed",
    "Found a better alternative course",
  ];

  for (let i = 1; i <= 20; i++) {
    const payment =
      mockPayments[Math.floor(Math.random() * mockPayments.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const reason = reasons[Math.floor(Math.random() * reasons.length)];

    // Refund amount can be partial or full
    const refundAmount =
      Math.random() > 0.3 ? payment.amount : Math.round(payment.amount * 0.5);

    const requestedAtDate = new Date(
      new Date(payment.createdAt!).getTime() +
        Math.random() * 30 * 24 * 60 * 60 * 1000 // Within 30 days of payment
    );
    const requestedAt = requestedAtDate.toISOString();

    const processedAt =
      status !== "PENDING"
        ? new Date(
            requestedAtDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000
          ).toISOString() // Within 7 days of request
        : null;

    refunds.push({
      id: `refund-${i}`,
      payment,
      amount: refundAmount,
      status,
      reason,
      requestedAt,
      processedAt,
    });
  }

  return refunds.sort(
    (a, b) =>
      new Date(b.requestedAt!).getTime() - new Date(a.requestedAt!).getTime()
  );
};

const initialState: RefundsState = {
  refunds: generateMockRefunds(),
  filteredRefunds: [],
  loading: false,
  error: null,
  searchQuery: "",
  statusFilter: "ALL",
  dateRange: {
    from: null,
    to: null,
  },
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 1,
};

const refundsSlice = createSlice({
  name: "refunds",
  initialState,
  reducers: {
    initializeFilters: (state) => {
      state.filteredRefunds = state.refunds;
      state.totalPages = Math.ceil(
        state.filteredRefunds.length / state.itemsPerPage
      );
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
      refundsSlice.caseReducers.applyFilters(state);
    },
    setStatusFilter: (
      state,
      action: PayloadAction<RefundsState["statusFilter"]>
    ) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
      refundsSlice.caseReducers.applyFilters(state);
    },
    setDateRange: (
      state,
      action: PayloadAction<{ from: string | null; to: string | null }>
    ) => {
      state.dateRange = action.payload;
      state.currentPage = 1;
      refundsSlice.caseReducers.applyFilters(state);
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
      state.totalPages = Math.ceil(
        state.filteredRefunds.length / state.itemsPerPage
      );
    },
    applyFilters: (state) => {
      let filtered = [...state.refunds];

      // Apply search filter
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (refund) =>
            refund.id.toLowerCase().includes(query) ||
            refund.payment.user.name.toLowerCase().includes(query) ||
            refund.payment.user.email.toLowerCase().includes(query) ||
            refund.payment.course.title.toLowerCase().includes(query) ||
            refund.reason.toLowerCase().includes(query)
        );
      }

      // Apply status filter
      if (state.statusFilter !== "ALL") {
        filtered = filtered.filter(
          (refund) => refund.status === state.statusFilter
        );
      }

      // Apply date range filter
      if (state.dateRange.from || state.dateRange.to) {
        filtered = filtered.filter((refund) => {
          const refundDate = new Date(refund.requestedAt!);
          const fromDate = state.dateRange.from
            ? new Date(state.dateRange.from)
            : null;
          const toDate = state.dateRange.to
            ? new Date(state.dateRange.to)
            : null;

          if (fromDate && refundDate < fromDate) return false;
          if (toDate && refundDate > toDate) return false;
          return true;
        });
      }

      state.filteredRefunds = filtered;
      state.totalPages = Math.ceil(filtered.length / state.itemsPerPage);

      // Reset to first page if current page is out of bounds
      if (state.currentPage > state.totalPages) {
        state.currentPage = 1;
      }
    },
    approveRefund: (state, action: PayloadAction<string>) => {
      const refundId = action.payload;
      const refund = state.refunds.find((r) => r.id === refundId);
      if (refund && refund.status === "PENDING") {
        refund.status = "COMPLETED";
        refund.processedAt = new Date().toISOString();
      }
      refundsSlice.caseReducers.applyFilters(state);
    },
    rejectRefund: (state, action: PayloadAction<string>) => {
      const refundId = action.payload;
      const refund = state.refunds.find((r) => r.id === refundId);
      if (refund && refund.status === "PENDING") {
        refund.status = "FAILED";
        refund.processedAt = new Date().toISOString();
      }
      refundsSlice.caseReducers.applyFilters(state);
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.statusFilter = "ALL";
      state.dateRange = { from: null, to: null };
      state.currentPage = 1;
      refundsSlice.caseReducers.applyFilters(state);
    },
  },
});

export const {
  initializeFilters,
  setSearchQuery,
  setStatusFilter,
  setDateRange,
  setCurrentPage,
  setItemsPerPage,
  applyFilters,
  approveRefund,
  rejectRefund,
  clearFilters,
} = refundsSlice.actions;

export default refundsSlice.reducer;
