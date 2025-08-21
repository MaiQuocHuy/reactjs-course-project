import { baseQueryWithReauth } from "@/lib/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";

// Types for API responses
export interface RefundUser {
  id: string;
  name: string;
  email: string;
  thumbnailUrl: string;
}

export interface RefundCard {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface RefundCourse {
  id: string;
  title: string;
  thumbnailUrl: string;
  instructor: {
    id: string;
    name: string;
    email: string;
    thumbnailUrl: string;
  };
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  price: number;
}

export interface RefundPaymentResponse {
  id: string;
  user: RefundUser;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  paidAt: string;
  paidoutAt: string | null;
  updatedAt: string;
  transactionId: string;
  stripeSessionId: string;
  receiptUrl: string;
  card: RefundCard;
  course: RefundCourse;
}

export interface RefundPaymentBasic {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface RefundResponse {
  id: string;
  payment: RefundPaymentBasic;
  reason: string;
  rejectedReason: string | null;
  amount: number;
  status: string;
  requestedAt: string;
  processedAt: string | null;
}

export interface RefundDetailResponse {
  id: string;
  payment: RefundPaymentResponse;
  reason: string;
  rejectedReason: string | null;
  amount: number;
  status: string;
  requestedAt: string;
  processedAt: string | null;
}

export interface RefundsApiResponse {
  statusCode: number;
  message: string;
  data: {
    content: RefundResponse[];
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

export interface RefundDetailApiResponse {
  statusCode: number;
  message: string;
  data: RefundDetailResponse;
  timestamp: string;
}

export interface UpdateRefundStatusRequest {
  status: "COMPLETED" | "FAILED";
  reason?: string;
}

export interface UpdateRefundStatusResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    paymentId: string;
    amount: number;
    status: string;
  };
  timestamp: string;
}

export const refundsApi = createApi({
  reducerPath: "refundsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Refund"],
  endpoints: (builder) => ({
    getRefunds: builder.query<
      RefundsApiResponse,
      { page?: number; size?: number }
    >({
      query: ({ page = 0, size = 10 } = {}) => ({
        url: `/admin/refund`,
        params: { page, size },
      }),
      providesTags: ["Refund"],
    }),
    getRefundById: builder.query<RefundDetailApiResponse, string>({
      query: (id) => `/admin/refund/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Refund", id }],
    }),
    updateRefundStatus: builder.mutation<
      UpdateRefundStatusResponse,
      { id: string; status: "COMPLETED" | "FAILED"; rejectedReason?: string }
    >({
      query: ({ id, status, rejectedReason }) => ({
        url: `/admin/refund/${id}/status`,
        method: "PATCH",
        body: status === "COMPLETED" ? { status } : { status, rejectedReason },
      }),
      invalidatesTags: ["Refund"],
    }),
  }),
});

export const {
  useGetRefundsQuery,
  useGetRefundByIdQuery,
  useUpdateRefundStatusMutation,
} = refundsApi;
