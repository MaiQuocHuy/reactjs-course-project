import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface RefundsState {
  // Filter states
  searchQuery: string;
  statusFilter: "ALL" | "PENDING" | "COMPLETED" | "FAILED";
  dateRange: {
    from: string | null;
    to: string | null;
  };
  // Pagination
  currentPage: number;
  itemsPerPage: number;
}

const initialState: RefundsState = {
  searchQuery: "",
  statusFilter: "ALL",
  dateRange: {
    from: null,
    to: null,
  },
  currentPage: 0, // API uses 0-based pagination
  itemsPerPage: 10,
};

const refundsSlice = createSlice({
  name: "refunds",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 0; // Reset to first page
    },
    setStatusFilter: (
      state,
      action: PayloadAction<RefundsState["statusFilter"]>
    ) => {
      state.statusFilter = action.payload;
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
      state.dateRange = { from: null, to: null };
      state.currentPage = 0;
    },
  },
});

export const {
  setSearchQuery,
  setStatusFilter,
  setDateRange,
  setCurrentPage,
  setItemsPerPage,
  clearFilters,
} = refundsSlice.actions;

export default refundsSlice;
