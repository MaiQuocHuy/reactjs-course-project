import { updateAccessToken, logout } from "@/store/authSlice";
import type { RefreshTokenResponse } from "@/types/auth";
import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query";

const baseUrl = import.meta.env.VITE_BACKEND_URL;


const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include', // Để gửi cookies (refresh token)
  prepareHeaders: (headers) => {

    const token = localStorage.getItem('accessToken')

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
      localStorage.setItem('accessToken', token);
    }
    
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

//tránh multiple refresh calls 
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Gọi API ban đầu
  let result = await baseQuery(args, api, extraOptions);

  // Nếu gặp lỗi 401 (Unauthorized), thử refresh token
   if (result?.error && result.error.status === 401) {
    console.log('Access token expired, attempting to refresh...');
    
    
    // Nếu đang refresh rồi thì đợi kết quả
    if (isRefreshing && refreshPromise) {
      try {
        await refreshPromise;
        // Retry với token mới
        result = await baseQuery(args, api, extraOptions);
        return result;
      } catch (error) {
        // Refresh failed, return original error
        return result;
      }
    }

    // Bắt đầu refresh process
    if (!isRefreshing) {
      isRefreshing = true;
      
      refreshPromise = (async () => {
        try {
          // Tạo một baseQuery riêng cho refresh (không dùng token cũ)
          const refreshBaseQuery = fetchBaseQuery({
            baseUrl,
            credentials: 'include', // Để gửi refresh token cookie
            prepareHeaders: (headers) => {
              headers.set('Content-Type', 'application/json');
              return headers;
            },
          });

          // Gọi refresh token API (refresh token ở cookie, không cần gửi trong body)
          const refreshResult = await refreshBaseQuery(
            {
              url: '/auth/refresh',
              method: 'POST',
            },
            api,
            extraOptions
          );

          if (refreshResult?.data) {
            const refreshData = refreshResult.data as RefreshTokenResponse;
            
            // Cập nhật access token mới trong localStorage và Redux
            localStorage.setItem('accessToken', refreshData.data.accessToken);
            api.dispatch(updateAccessToken(refreshData.data.accessToken));
            
            console.log('Token refreshed successfully');
            return true;
          } else {
            console.log('Refresh token expired or invalid');
            return false;
          }
        } catch (error) {
          console.error('Refresh token error:', error);
          return false;
        }
      })();

      try {
        const refreshSuccess = await refreshPromise;
        
        if (refreshSuccess) {
          // Retry API call ban đầu với token mới
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh token cũng fail, logout user
          console.log('Refresh failed, logging out...');
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          api.dispatch(logout());
          
          // Có thể redirect về login page ở đây
          window.location.href = '/login';
        }
      } finally {
        // Reset refresh state
        isRefreshing = false;
        refreshPromise = null;
      }
    }
  }

  return result;
};