import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthState } from '../types/auth';

// Helper functions cho localStorage
const getStoredAuth = (): { user: User | null; accessToken: string | null } => {
  try {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      accessToken: storedToken,
    };
  } catch {
    return { user: null, accessToken: null };
  }
};

const setStoredAuth = (user: User | null, accessToken: string | null) => {
  if (user && accessToken) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
  } else {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  }
};

const storedAuth = getStoredAuth();

const initialState: AuthState = {
  user: storedAuth.user,
  accessToken: storedAuth.accessToken,
  isAuthenticated: !!storedAuth.accessToken,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      
      // Lưu vào localStorage
      setStoredAuth(user, accessToken);
    },
    
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      // Cập nhật localStorage với token mới
      if (state.user) {
        setStoredAuth(state.user, action.payload);
      }
    },
    
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      
      // Clear localStorage
      setStoredAuth(null, null);
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, updateAccessToken, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;