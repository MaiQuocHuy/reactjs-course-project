// src/store.ts

// import counterSlice from "@/features/counter/counterSlice";
import paymentsSlice from "@/features/payments/paymentsSlice";
import refundsSlice from "@/features/refunds/refundsSlice";
import { authApi } from "@/services/authApi";
import { usersApi } from "@/services/usersApi";
import { paymentsApi } from "@/services/paymentsApi";
import { refundsApi } from "@/services/refundsApi";
import { coursesApi } from "@/services/courses-api";
import { categoriesApi } from "@/services/categoriesApi";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { applicationsApi } from "@/services/applicationsApi";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [refundsApi.reducerPath]: refundsApi.reducer,
    [applicationsApi.reducerPath]: applicationsApi.reducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    // counter: counterSlice.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    payments: paymentsSlice.reducer,
    refunds: refundsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(usersApi.middleware)
      .concat(paymentsApi.middleware)
      .concat(refundsApi.middleware)
      .concat(applicationsApi.middleware)
      .concat(coursesApi.middleware)
      .concat(categoriesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
