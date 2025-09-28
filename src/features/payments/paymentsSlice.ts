import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface PaymentsState {
  // Filter states
  searchQuery: string;
  statusFilter: "ALL" | "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paymentMethodFilter: "ALL" | "stripe" | "paypal";
  dateRange: {
    from: string | null;
    to: string | null;
  };
  // Pagination
  currentPage: number;
  itemsPerPage: number;
}

const initialState: PaymentsState = {
  searchQuery: "",
  statusFilter: "ALL",
  paymentMethodFilter: "ALL",
  dateRange: {
    from: null,
    to: null,
  },
  currentPage: 0, // API uses 0-based pagination
  itemsPerPage: 10,
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 0; // Reset to first page
    },
    setStatusFilter: (
      state,
      action: PayloadAction<PaymentsState["statusFilter"]>
    ) => {
      state.statusFilter = action.payload;
      state.currentPage = 0; // Reset to first page
    },
    setPaymentMethodFilter: (
      state,
      action: PayloadAction<PaymentsState["paymentMethodFilter"]>
    ) => {
      state.paymentMethodFilter = action.payload;
      state.currentPage = 0; // Reset to first page
    },
    setDateRange: (
      state,
      action: PayloadAction<{ from: string | null; to: string | null }>
    ) => {
      state.dateRange = action.payload;
      state.currentPage = 0; // Reset to first page
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 0; // Reset to first page
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.statusFilter = "ALL";
      state.paymentMethodFilter = "ALL";
      state.dateRange = { from: null, to: null };
      state.currentPage = 0;
    },
  },
});

export const {
  setSearchQuery,
  setStatusFilter,
  setPaymentMethodFilter,
  setDateRange,
  setCurrentPage,
  setItemsPerPage,
  clearFilters,
} = paymentsSlice.actions;

export default paymentsSlice;
