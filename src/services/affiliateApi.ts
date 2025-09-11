import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: {
    number: number;
    size: number;
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
  };
}

export interface AffiliatePayout {
  id: string;
  referredByUser: {
    id: string;
    name: string;
    email: string;
  };
  course: {
    id: string;
    name: string;
  };
  discountUsage?: {
    id: string;
    discount: {
      code: string;
      type: string;
    };
  };
  commissionPercent: number;
  commissionAmount: number;
  payoutStatus: 'PENDING' | 'PAID' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  cancelledAt?: string;
}

export interface AffiliateStatistics {
  totalPayouts: number;
  pendingPayouts: number;
  paidPayouts: number;
  cancelledPayouts: number;
  totalCommissionAmount: number;
  pendingCommissionAmount: number;
  paidCommissionAmount: number;
  cancelledCommissionAmount: number;
}

export interface PayoutParams {
  page?: number;
  size?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
  minAmount?: number;
  maxAmount?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export const affiliateApi = createApi({
  reducerPath: 'affiliateApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AffiliatePayout', 'AffiliateStats'],
  endpoints: (builder) => ({
    // Get all affiliate payouts with pagination and filters (Admin only)
    getAffiliatePayouts: builder.query<
      ApiResponse<PaginatedResponse<AffiliatePayout>>,
      PayoutParams
    >({
      query: (params = {}) => {
        const queryParams: any = {
          page: params.page || 0,
          size: params.size || 20,
        };
        
        // Add sort parameter in Spring Boot format
        if (params.sort && params.direction) {
          queryParams.sort = `${params.sort},${params.direction}`;
        }
        
        // Add filter parameters
        if (params.status) queryParams.status = params.status;
        if (params.startDate) queryParams.startDate = params.startDate;
        if (params.endDate) queryParams.endDate = params.endDate;
        if (params.userId) queryParams.userId = params.userId;
        if (params.minAmount) queryParams.minAmount = params.minAmount;
        if (params.maxAmount) queryParams.maxAmount = params.maxAmount;
        
        return {
          url: '/admin/affiliate/payouts',
          method: 'GET',
          params: queryParams,
        };
      },
      providesTags: ['AffiliatePayout'],
    }),

    // Get affiliate payout statistics (Admin only)
    getAffiliateStatistics: builder.query<
      ApiResponse<AffiliateStatistics>,
      void
    >({
      query: () => ({
        url: '/admin/affiliate/statistics',
        method: 'GET',
      }),
      providesTags: ['AffiliateStats'],
    }),

    // Get specific affiliate payout by ID (Admin only)
    getAffiliatePayoutById: builder.query<ApiResponse<AffiliatePayout>, string>({
      query: (id) => ({
        url: `/admin/affiliate/payouts/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'AffiliatePayout', id }],
    }),

    // Mark payout as paid (Admin only)
    markPayoutAsPaid: builder.mutation<ApiResponse<AffiliatePayout>, string>({
      query: (id) => ({
        url: `/admin/affiliate/payouts/${id}/mark-paid`,
        method: 'PATCH',
      }),
      invalidatesTags: ['AffiliatePayout', 'AffiliateStats'],
    }),

    // Cancel payout (Admin only)
    cancelPayout: builder.mutation<
      ApiResponse<AffiliatePayout>,
      { id: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: `/admin/affiliate/payouts/${id}/cancel`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: ['AffiliatePayout', 'AffiliateStats'],
    }),

    // Bulk action on payouts (Admin only)
    bulkActionPayouts: builder.mutation<
      ApiResponse<string>,
      { payoutIds: string[]; action: 'MARK_PAID' | 'CANCEL'; reason?: string }
    >({
      query: ({ payoutIds, action, reason }) => ({
        url: '/admin/affiliate/payouts/bulk-action',
        method: 'POST',
        body: { payoutIds, action, reason },
      }),
      invalidatesTags: ['AffiliatePayout', 'AffiliateStats'],
    }),

    // Export payouts to CSV (Admin only)
    exportPayouts: builder.mutation<Blob, PayoutParams>({
      query: (params = {}) => ({
        url: '/admin/affiliate/payouts/export',
        method: 'GET',
        params: {
          ...(params.status && { status: params.status }),
          ...(params.startDate && { startDate: params.startDate }),
          ...(params.endDate && { endDate: params.endDate }),
          ...(params.userId && { userId: params.userId }),
          ...(params.minAmount && { minAmount: params.minAmount }),
          ...(params.maxAmount && { maxAmount: params.maxAmount }),
        },
      }),
      transformResponse: (response: any) => response,
    }),
  }),
});

export const {
  useGetAffiliatePayoutsQuery,
  useGetAffiliateStatisticsQuery,
  useGetAffiliatePayoutByIdQuery,
  useMarkPayoutAsPaidMutation,
  useCancelPayoutMutation,
  useBulkActionPayoutsMutation,
  useExportPayoutsMutation,
} = affiliateApi;
