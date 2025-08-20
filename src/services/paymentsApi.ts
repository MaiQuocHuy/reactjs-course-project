import type {
  PaidOutResponse,
  PaymentDetailApiResponse,
  PaymentsApiResponse,
  UpdatePaymentStatusResponse,
} from "@/types/payments";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    prepareHeaders: (headers) => {
      // Hardcode bearer token as requested
      headers.set(
        "authorization",
        "Bearer eyJhbGciOiJIUzM4NCJ9.eyJyb2xlcyI6WyJST0xFX0FETUlOIl0sInN1YiI6ImFsaWNlQGV4YW1wbGUuY29tIiwiaWF0IjoxNzU1NjgyODU4LCJleHAiOjE3NTU2ODY0NTh9.v0J2V5qhZooh785Hune8IawoTLlkaw9P-ecx3gNbdd23l_qDESf7YqNito63Hnw_"
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
    paidOutPayment: builder.mutation<PaidOutResponse, string>({
      query: (paymentId) => ({
        url: `/admin/payments/${paymentId}/paid-out`,
        method: "POST",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useUpdatePaymentStatusMutation,
  usePaidOutPaymentMutation,
} = paymentsApi;
