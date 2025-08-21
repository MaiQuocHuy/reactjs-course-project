// src/store.ts
import counterSlice from "@/features/counter/counterSlice";
import paymentsSlice from "@/features/payments/paymentsSlice";
import refundsSlice from "@/features/refunds/refundsSlice";
import { authApi } from "@/services/authApi";
import { usersApi } from "@/services/usersApi";
import { paymentsApi } from "@/services/paymentsApi";
import { refundsApi } from "@/services/refundsApi";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [refundsApi.reducerPath]: refundsApi.reducer,
    counter: counterSlice.reducer,
    payments: paymentsSlice.reducer,
    refunds: refundsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(usersApi.middleware)
      .concat(paymentsApi.middleware)
      .concat(refundsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
