// src/store.ts
import counterSlice from "@/features/counter/counterSlice";
import paymentsSlice from "@/features/payments/paymentsSlice";
import { authApi } from "@/services/authApi";
import { configureStore } from "@reduxjs/toolkit";
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    counter: counterSlice.reducer,
    payments: paymentsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
