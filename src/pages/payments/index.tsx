import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/payments/SearchBar";
import { FilterBar } from "@/components/payments/FilterBar";
import { PaymentsTable } from "@/components/payments/PaymentsTable";
import { Pagination } from "@/components/payments/Pagination";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { initializeFilters } from "@/features/payments/paymentsSlice";

export const PaymentsPage = () => {
  const dispatch = useAppDispatch();
  const { filteredPayments, payments } = useAppSelector(
    (state) => state.payments
  );

  // Initialize filters on component mount
  useEffect(() => {
    dispatch(initializeFilters());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Payments Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage all payment transactions
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <SearchBar />
            <div className="lg:flex-1 lg:max-w-none">
              <FilterBar />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <div className="space-y-4">
        <PaymentsTable />

        {/* Pagination */}
        {filteredPayments.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <Pagination />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results Summary */}
      {filteredPayments.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {filteredPayments.length} of {payments.length} total payments
        </div>
      )}
    </div>
  );
};
