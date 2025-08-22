// src/store.ts
import counterSlice from "@/features/counter/counterSlice";
import paymentsSlice from "@/features/payments/paymentsSlice";
import refundsSlice from "@/features/refunds/refundsSlice";
import { authApi } from "@/services/authApi";
import { usersApi } from "@/services/usersApi";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { applicationsApi } from "@/services/applicationsApi";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [applicationsApi.reducerPath]: applicationsApi.reducer,
    counter: counterSlice.reducer,
    payments: paymentsSlice.reducer,
    refunds: refundsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(usersApi.middleware)
      .concat(applicationsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
