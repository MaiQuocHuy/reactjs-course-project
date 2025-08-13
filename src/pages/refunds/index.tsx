import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RefundSearchBar } from "@/components/refunds/RefundSearchBar";
import { RefundFilterBar } from "@/components/refunds/RefundFilterBar";
import { RefundsTable } from "@/components/refunds/RefundsTable";
import { Pagination } from "@/components/payments/Pagination";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { initializeFilters } from "@/features/refunds/refundsSlice";

const RefundsPage = () => {
  const dispatch = useAppDispatch();
  const { filteredRefunds, refunds } = useAppSelector((state) => state.refunds);

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
            Refunds Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and process refund requests
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <RefundSearchBar />
            <div className="lg:flex-1 lg:max-w-none">
              <RefundFilterBar />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refunds Table */}
      <div className="space-y-4">
        <RefundsTable />

        {/* Pagination */}
        {filteredRefunds.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <Pagination />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results Summary */}
      {filteredRefunds.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {filteredRefunds.length} of {refunds.length} total refunds
        </div>
      )}
    </div>
  );
};

export default RefundsPage;
