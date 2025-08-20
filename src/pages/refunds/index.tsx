import { Card, CardContent } from "@/components/ui/card";
import {
  RefundSearchBar,
  RefundFilterBar,
  RefundsTable,
  RefundEmptyState,
} from "@/components/refunds";
import { useGetRefundsQuery } from "@/services/refundsApi";
import { useAppSelector } from "@/hooks/redux";
import { Skeleton } from "@/components/ui/skeleton";

const RefundsPage = () => {
  const { currentPage, itemsPerPage } = useAppSelector(
    (state) => state.refunds
  );
  const { data, isLoading, error } = useGetRefundsQuery({
    page: currentPage,
    size: itemsPerPage,
  });

  if (error) {
    return (
      <div className="container mx-auto p-4 lg:p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Error Loading Refunds
          </h2>
          <p className="text-muted-foreground mt-2">
            Failed to load refunds. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const refunds = data?.data?.content || [];
  const totalElements = data?.data?.page?.totalElements || 0;

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
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : refunds.length === 0 ? (
          <RefundEmptyState type="no-data" />
        ) : (
          <>
            <RefundsTable />
          </>
        )}
      </div>

      {/* Results Summary */}
      {refunds.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {refunds.length} of {totalElements} total refunds
        </div>
      )}
    </div>
  );
};

export default RefundsPage;
