import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';
import type { ApiResponse, PaginatedResponse } from '@/types/common';
import type {
  CreateDiscountRequest,
  Discount,
  GetDiscountsParams,
} from '@/types/discounts';

export const discountsApi = createApi({
  reducerPath: 'discountsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Discounts'],
  endpoints: (builder) => ({
    // Get all discounts with pagination
    getAllDiscounts: builder.query<
      PaginatedResponse<Discount>,
      GetDiscountsParams
    >({
      query: ({
        page = 0,
        size = 10,
        sortBy = 'createdAt',
        sortDir = 'DESC',
      } = {}) => ({
        url: '/discounts',
        params: { page, size, sortBy, sortDir },
      }),
      transformResponse: (response: ApiResponse<PaginatedResponse<Discount>>) =>
        response.data,
      providesTags: [{ type: 'Discounts', id: 'LIST' }],
    }),

    // Get discount by ID
    getDiscountById: builder.query<Discount, string>({
      query: (id) => `/discounts/${id}`,
      transformResponse: (response: ApiResponse<Discount>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Discounts', id }],
    }),

    // Create a new discount
    createDiscount: builder.mutation<ApiResponse<Discount>, CreateDiscountRequest>({
      query: (discount) => ({
        url: '/discounts',
        method: 'POST',
        body: discount,
      }),
      transformErrorResponse: (response: { status: number; data: any }) => {
        let errorMessage = 'Failed to create discount!';
        if (response.data && 'message' in response.data) {
          errorMessage = response.data.message;
        }
        return {
          status: response.status,
          message: errorMessage,
          data: response.data,
        };
      },
      invalidatesTags: ['Discounts'],
    }),

    // Delete a discount by ID
    deleteDiscount: builder.mutation<void, string>({
      query: (id) => ({
        url: `/discounts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Discounts', id },
        { type: 'Discounts', id: 'LIST' },
      ],
    }),

    // Update discount status (activate/deactivate)
    updateDiscountStatus: builder.mutation<
      Discount,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/discounts/${id}/status`,
        method: 'PATCH',
        params: { isActive },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Discounts', id },
        { type: 'Discounts', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllDiscountsQuery,
  useGetDiscountByIdQuery,
  useCreateDiscountMutation,
  useDeleteDiscountMutation,
  useUpdateDiscountStatusMutation,
} = discountsApi;
