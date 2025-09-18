import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';
import type {
  Statistics,
  MonthlyRevenue,
  DailyData,
  TopSpenders,
  PerformanceMetrics,
  ComparativeAnalysis,
  SeasonalHeatmap,
} from '@/types/revenues';
import type { ApiResponse } from '@/types/common';

export const revenuesApi = createApi({
  reducerPath: 'revenuesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Revenues'],
  endpoints: (builder) => ({
    getStatistics: builder.query<Statistics, void>({
      query: () => '/admin/revenues/statistics',
      transformResponse: (response: ApiResponse<Statistics>) => response.data,
      providesTags: [{ type: 'Revenues', id: 'statistics' }],
    }),

    getMonthlyRevenue: builder.query<MonthlyRevenue, { year?: number }>({
      query: ({ year = 2024 } = {}) => ({
        url: '/admin/revenues/monthly',
        params: { year },
      }),
      transformResponse: (response: ApiResponse<MonthlyRevenue>) => response.data,
      providesTags: [{ type: 'Revenues', id: 'monthly' }],
    }),

    getDailyRevenue: builder.query<DailyData[], { year?: number; month: number }>({
      query: ({ year = 2025, month }) => ({
        url: '/admin/revenues/daily',
        params: { year, month },
      }),
      transformResponse: (response: ApiResponse<DailyData[]>) => response.data,
      providesTags: [{ type: 'Revenues', id: 'daily' }],
    }),

    getTopSpenders: builder.query<TopSpenders, { limit?: number }>({
      query: ({ limit = 5 } = {}) => ({
        url: '/admin/revenues/top-spenders',
        params: { limit },
      }),
      transformResponse: (response: ApiResponse<TopSpenders>) => response.data,
      providesTags: [{ type: 'Revenues', id: 'top-spenders' }],
    }),

    getPerformanceMetrics: builder.query<PerformanceMetrics, void>({
      query: () => '/admin/revenues/performance',
      transformResponse: (response: ApiResponse<PerformanceMetrics>) => response.data,
      providesTags: [{ type: 'Revenues', id: 'performance' }],
    }),

    getComparativeAnalysis: builder.query<ComparativeAnalysis, { period?: 'monthly' | 'quarterly' | 'yearly'; year?: number }>({
      query: ({ period = 'monthly', year = 2025 } = {}) => ({
        url: '/admin/revenues/comparative',
        params: { period, year },
      }),
      transformResponse: (response: ApiResponse<ComparativeAnalysis>) => response.data,
      providesTags: [{ type: 'Revenues', id: 'comparative' }],
    }),

    getSeasonalHeatmap: builder.query<SeasonalHeatmap, { year?: number }>({
      query: ({ year = 2025 } = {}) => ({
        url: '/admin/revenues/seasonal',
        params: { year },
      }),
      transformResponse: (response: ApiResponse<SeasonalHeatmap>) => response.data,
      providesTags: [{ type: 'Revenues', id: 'seasonal' }],
    }),

    getAvailableYears: builder.query<number[], void>({
      query: () => '/admin/revenues/available-years',
      transformResponse: (response: ApiResponse<number[]>) => response.data,
      providesTags: [{ type: 'Revenues', id: 'available-years' }],
    }),

    getRevenueSummary: builder.query<any, { year?: number }>({
      query: ({ year = 2024 } = {}) => ({
        url: '/admin/revenues/summary',
        params: { year },
      }),
      providesTags: [{ type: 'Revenues', id: 'summary' }],
    }),
  }),
});

export const {
  useGetStatisticsQuery,
  useGetMonthlyRevenueQuery,
  useGetDailyRevenueQuery,
  useGetTopSpendersQuery,
  useGetPerformanceMetricsQuery,
  useGetComparativeAnalysisQuery,
  useGetSeasonalHeatmapQuery,
  useGetAvailableYearsQuery,
  useGetRevenueSummaryQuery,
} = revenuesApi;
