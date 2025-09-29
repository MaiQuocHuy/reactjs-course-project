import { createApi } from '@reduxjs/toolkit/query/react';

import { setCredentials, logout, updateAccessToken } from '../store/authSlice';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from '../types/auth';
import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    // Login mutation
    loginAdmin: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login-admin',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Lưu vào localStorage trước
          localStorage.setItem('user', JSON.stringify(data.data.user));
          localStorage.setItem('accessToken', data.data.accessToken);
          
          // Sau đó update Redux store
          dispatch(
            setCredentials({
              user: data.data.user,
              accessToken: data.data.accessToken,
            })
          );
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),

    // Refresh token mutation (để manual call nếu cần)
    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Cập nhật localStorage trước
          localStorage.setItem('accessToken', data.data.accessToken);
          
          // Sau đó update Redux
          dispatch(updateAccessToken(data.data.accessToken));
        } catch (error) {
          console.error('Token refresh failed:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          dispatch(logout());
        }
      },
    }),

    // Logout mutation
    logout: builder.mutation<any, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Logout API failed:', error);
        } finally {
          // Dù API có fail hay không thì vẫn clear localStorage và Redux
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          dispatch(logout());
        }
      },
    }),

    logoutAdmin: builder.mutation<any, void>({
      query: () => ({
        url: '/auth/admin/logout',
        method: 'POST',
        credentials: 'include', // Gửi cookie kèm theo
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Logout API failed:', error);
        } finally {
          // Dù API có fail hay không thì vẫn clear localStorage và Redux
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          dispatch(logout());
        }
      },
    }),
  }),
});

export const {
  useLoginAdminMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useLogoutAdminMutation
} = authApi;