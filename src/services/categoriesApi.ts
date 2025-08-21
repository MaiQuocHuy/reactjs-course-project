import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';

// Category interfaces based on API response
export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  courseCount: number;
}

export interface CategoryRequest {
  name: string;
  description?: string;
}

// Pagination interfaces matching Spring Boot Page structure
export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface CategoryPageResponse {
  content: Category[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

// Query parameters for category list
export interface CategoryQueryParams {
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    // Get all categories for dropdown (public endpoint)
    getAllCategoriesDropdown: builder.query<ApiResponse<Category[]>, void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),

    // Get categories with pagination (admin endpoint)
    getCategories: builder.query<ApiResponse<CategoryPageResponse>, CategoryQueryParams>({
      query: ({ search, page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
          sortBy,
          sortDir,
        });
        
        if (search) {
          params.append('search', search);
        }

        return `/admin/categories?${params.toString()}`;
      },
      providesTags: ['Category'],
    }),

    // Get category by ID
    getCategoryById: builder.query<ApiResponse<Category>, string>({
      query: (id) => `/admin/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Category', id }],
    }),

    // Create new category
    createCategory: builder.mutation<ApiResponse<Category>, CategoryRequest>({
      query: (categoryData) => ({
        url: '/admin/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Category'],
    }),

    // Update category
    updateCategory: builder.mutation<ApiResponse<Category>, { id: string; data: CategoryRequest }>({
      query: ({ id, data }) => ({
        url: `/admin/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Category',
        { type: 'Category', id },
      ],
    }),

    // Delete category
    deleteCategory: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetAllCategoriesDropdownQuery,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;