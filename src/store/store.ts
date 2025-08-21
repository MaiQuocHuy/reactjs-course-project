// src/store.ts
import { configureStore } from "@reduxjs/toolkit";

// import counterSlice from "@/features/counter/counterSlice";
import paymentsSlice from "@/features/payments/paymentsSlice";
import refundsSlice from "@/features/refunds/refundsSlice";
import { authApi } from "@/services/authApi";
import { usersApi } from "@/services/usersApi";
import { coursesApi } from "@/services/courses-api";
import { categoriesApi } from "@/services/categoriesApi";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    // counter: counterSlice.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    counter: counterSlice.reducer,
    payments: paymentsSlice.reducer,
    refunds: refundsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(usersApi.middleware)
      .concat(coursesApi.middleware)
      .concat(usersApi.middleware)
      .concat(categoriesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
