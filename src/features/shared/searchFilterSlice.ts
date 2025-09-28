import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Base interface for common search and filter functionality
interface BaseSearchFilterState {
  searchQuery: string;
  dateRange: {
    from: string | null;
    to: string | null;
  };
  currentPage: number;
  itemsPerPage: number;
}

// Interface for payments (includes payment method filter and REFUNDED status)
interface PaymentsSearchFilterState extends BaseSearchFilterState {
  statusFilter: "ALL" | "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paymentMethodFilter: "ALL" | "stripe" | "paypal";
}

// Interface for refunds (does not include REFUNDED status)
interface RefundsSearchFilterState extends BaseSearchFilterState {
  statusFilter: "ALL" | "PENDING" | "COMPLETED" | "FAILED";
}

// State structure for the combined slice
interface SearchFilterState {
  payments: PaymentsSearchFilterState;
  refunds: RefundsSearchFilterState;
}

const baseInitialState: BaseSearchFilterState = {
  searchQuery: "",
  dateRange: {
    from: null,
    to: null,
  },
  currentPage: 0, // API uses 0-based pagination
  itemsPerPage: 10,
};

const initialState: SearchFilterState = {
  payments: {
    ...baseInitialState,
    statusFilter: "ALL",
    paymentMethodFilter: "ALL",
  },
  refunds: {
    ...baseInitialState,
    statusFilter: "ALL",
  },
};

const searchFilterSlice = createSlice({
  name: "searchFilter",
  initialState,
  reducers: {
    // Payments actions
    setPaymentsSearchQuery: (state, action: PayloadAction<string>) => {
      state.payments.searchQuery = action.payload;
      state.payments.currentPage = 0;
    },
    setPaymentsStatusFilter: (
      state,
      action: PayloadAction<PaymentsSearchFilterState["statusFilter"]>
    ) => {
      state.payments.statusFilter = action.payload;
      state.payments.currentPage = 0;
    },
    setPaymentsPaymentMethodFilter: (
      state,
      action: PayloadAction<PaymentsSearchFilterState["paymentMethodFilter"]>
    ) => {
      state.payments.paymentMethodFilter = action.payload;
      state.payments.currentPage = 0;
    },
    setPaymentsDateRange: (
      state,
      action: PayloadAction<{ from: string | null; to: string | null }>
    ) => {
      state.payments.dateRange = action.payload;
      state.payments.currentPage = 0;
    },
    setPaymentsCurrentPage: (state, action: PayloadAction<number>) => {
      state.payments.currentPage = action.payload;
    },
    setPaymentsItemsPerPage: (state, action: PayloadAction<number>) => {
      state.payments.itemsPerPage = action.payload;
      state.payments.currentPage = 0;
    },
    clearPaymentsFilters: (state) => {
      state.payments.searchQuery = "";
      state.payments.statusFilter = "ALL";
      state.payments.paymentMethodFilter = "ALL";
      state.payments.dateRange = { from: null, to: null };
      state.payments.currentPage = 0;
    },

    // Refunds actions
    setRefundsSearchQuery: (state, action: PayloadAction<string>) => {
      state.refunds.searchQuery = action.payload;
      state.refunds.currentPage = 0;
    },
    setRefundsStatusFilter: (
      state,
      action: PayloadAction<RefundsSearchFilterState["statusFilter"]>
    ) => {
      state.refunds.statusFilter = action.payload;
      state.refunds.currentPage = 0;
    },
    setRefundsDateRange: (
      state,
      action: PayloadAction<{ from: string | null; to: string | null }>
    ) => {
      state.refunds.dateRange = action.payload;
      state.refunds.currentPage = 0;
    },
    setRefundsCurrentPage: (state, action: PayloadAction<number>) => {
      state.refunds.currentPage = action.payload;
    },
    setRefundsItemsPerPage: (state, action: PayloadAction<number>) => {
      state.refunds.itemsPerPage = action.payload;
      state.refunds.currentPage = 0;
    },
    clearRefundsFilters: (state) => {
      state.refunds.searchQuery = "";
      state.refunds.statusFilter = "ALL";
      state.refunds.dateRange = { from: null, to: null };
      state.refunds.currentPage = 0;
    },
  },
});

export const {
  // Payments actions
  setPaymentsSearchQuery,
  setPaymentsStatusFilter,
  setPaymentsPaymentMethodFilter,
  setPaymentsDateRange,
  setPaymentsCurrentPage,
  setPaymentsItemsPerPage,
  clearPaymentsFilters,

  // Refunds actions
  setRefundsSearchQuery,
  setRefundsStatusFilter,
  setRefundsDateRange,
  setRefundsCurrentPage,
  setRefundsItemsPerPage,
  clearRefundsFilters,
} = searchFilterSlice.actions;

export default searchFilterSlice;
export type {
  SearchFilterState,
  PaymentsSearchFilterState,
  BaseSearchFilterState,
};
