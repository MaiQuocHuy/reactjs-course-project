import { baseQueryWithReauth } from "@/lib/baseQueryWithReauth";
import type {
  RefundDetailApiResponse,
  RefundsApiResponse,
  RefundStatisticsResponse,
} from "@/types/refunds";
import { createApi } from "@reduxjs/toolkit/query/react";

// Refund query parameters interface
export interface RefundQueryParams {
  search?: string;
  status?: "PENDING" | "COMPLETED" | "FAILED";
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

export const refundsApi = createApi({
  reducerPath: "refundsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Refund"],
  endpoints: (builder) => ({
    getRefunds: builder.query<RefundsApiResponse, RefundQueryParams>({
      query: ({
        search,
        status,
        fromDate,
        toDate,
        page = 0,
        size = 10,
      } = {}) => {
        const params: Record<string, any> = { page, size };

        if (search) params.search = search;
        if (status) params.status = status;
        if (fromDate) params.fromDate = fromDate;
        if (toDate) params.toDate = toDate;

        return {
          url: `/admin/refund`,
          params,
        };
      },
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
