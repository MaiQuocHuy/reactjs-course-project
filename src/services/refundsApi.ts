import { baseQueryWithReauth } from "@/lib/baseQueryWithReauth";
import type {
  RefundDetailApiResponse,
  RefundsApiResponse,
  UpdateRefundStatusResponse,
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
