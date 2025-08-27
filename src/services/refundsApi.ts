import { baseQueryWithReauth } from "@/lib/baseQueryWithReauth";
import type {
  RefundDetailApiResponse,
  RefundsApiResponse,
  RefundStatisticsResponse,
} from "@/types/refunds";
import { createApi } from "@reduxjs/toolkit/query/react";

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
    getRefundStatistics: builder.query<RefundStatisticsResponse, void>({
      query: () => `/admin/refund/statistics`,
      providesTags: ["Refund"],
    }),
  }),
});

export const {
  useGetRefundsQuery,
  useGetRefundByIdQuery,
  useGetRefundStatisticsQuery,
} = refundsApi;
