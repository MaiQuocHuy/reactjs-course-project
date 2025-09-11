// src/store.ts

// import counterSlice from "@/features/counter/counterSlice";
import paymentsSlice from "@/features/payments/paymentsSlice";
import refundsSlice from "@/features/refunds/refundsSlice";
import searchFilterSlice from "@/features/shared/searchFilterSlice";
import { authApi } from "@/services/authApi";
import { usersApi } from "@/services/usersApi";
import { paymentsApi } from "@/services/paymentsApi";
import { refundsApi } from "@/services/refundsApi";
import { coursesApi } from "@/services/courses-api";
import { categoriesApi } from "@/services/categoriesApi";
import { rolesApi } from "@/services/rolesApi";
import { permissionsApi } from "@/services/permissionsApi";
import { affiliateApi } from "@/services/affiliateApi";
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
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [permissionsApi.reducerPath]: permissionsApi.reducer,
    [affiliateApi.reducerPath]: affiliateApi.reducer,
    // counter: counterSlice.reducer,
    payments: paymentsSlice.reducer,
    refunds: refundsSlice.reducer,
    searchFilter: searchFilterSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(usersApi.middleware)
      .concat(paymentsApi.middleware)
      .concat(refundsApi.middleware)
      .concat(applicationsApi.middleware)
      .concat(coursesApi.middleware)
      .concat(categoriesApi.middleware)
      .concat(rolesApi.middleware)
      .concat(permissionsApi.middleware)
      .concat(affiliateApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
