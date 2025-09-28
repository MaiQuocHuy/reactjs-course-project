import { baseQueryWithReauth } from "@/lib/baseQueryWithReauth";
import type {
  PaidOutResponse,
  PaymentDetailApiResponse,
  PaymentsApiResponse,
  PaymentStatisticsResponse,
  UpdatePaymentStatusResponse,
} from "@/types/payments";
import { createApi } from "@reduxjs/toolkit/query/react";

// Payment query parameters interface
export interface PaymentQueryParams {
  search?: string;
  status?: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  fromDate?: string;
  toDate?: string;
  paymentMethod?: string;
  page?: number;
  size?: number;
}

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    getPayments: builder.query<PaymentsApiResponse, PaymentQueryParams>({
      query: ({
        search,
        status,
        fromDate,
        toDate,
        paymentMethod,
        page = 0,
        size = 10,
      } = {}) => {
        const params: Record<string, any> = { page, size };

        if (search) params.search = search;
        if (status) params.status = status;
        if (fromDate) params.fromDate = fromDate;
        if (toDate) params.toDate = toDate;
        if (paymentMethod) params.paymentMethod = paymentMethod;

        return {
          url: `/admin/payments`,
          params,
        };
      },
      providesTags: ["Payment"],
    }),
    getPaymentById: builder.query<PaymentDetailApiResponse, string>({
      query: (id) => `/admin/payments/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Payment", id }],
    }),
    getPaymentStatistics: builder.query<PaymentStatisticsResponse, void>({
      query: () => `/admin/payments/statistics`,
      providesTags: ["Payment"],
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
  useGetPaymentStatisticsQuery,
  useUpdatePaymentStatusMutation,
  usePaidOutPaymentMutation,
} = paymentsApi;
