import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
  transactionId: string | null;
  stripeSessionId: string | null;
  receiptUrl: string | null;
  card: any | null;
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

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    prepareHeaders: (headers) => {
      // Hardcode bearer token as requested
      headers.set(
        "authorization",
        "Bearer eyJhbGciOiJIUzM4NCJ9.eyJyb2xlcyI6WyJST0xFX0FETUlOIl0sInN1YiI6ImFsaWNlQGV4YW1wbGUuY29tIiwiaWF0IjoxNzU1NTk0Nzk1LCJleHAiOjE3NTU1OTgzOTV9.qbLTeFavdb9KEuc3SjOVlWmrS0IudfQe1bsLb9cPP7-uBmhF9YnMozMaNWu-PcCV"
      );
      return headers;
    },
  }),
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    getPayments: builder.query<
      PaymentsApiResponse,
      { page?: number; size?: number }
    >({
      query: ({ page = 0, size = 10 } = {}) => ({
        url: `/admin/payments`,
        params: { page, size },
      }),
      providesTags: ["Payment"],
    }),
    getPaymentById: builder.query<PaymentDetailApiResponse, string>({
      query: (id) => `/admin/payments/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Payment", id }],
    }),
    updatePaymentStatus: builder.mutation<
      UpdatePaymentStatusResponse,
      { id: string; status: "COMPLETED" | "FAILED" }
    >({
      query: ({ id, status }) => ({
        url: `/admin/payments/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useUpdatePaymentStatusMutation,
} = paymentsApi;
