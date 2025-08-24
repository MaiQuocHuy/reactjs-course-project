import { Card, CardContent } from "@/components/ui/card";
import { SearchBar, FilterBar, Pagination } from "@/components/shared";
import { RefundsTable, RefundEmptyState } from "@/components/refunds";
import { useGetRefundsQuery } from "@/services/refundsApi";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { Skeleton } from "@/components/ui/skeleton";
import {
  setRefundsSearchQuery,
  setRefundsStatusFilter,
  setRefundsDateRange,
  setRefundsCurrentPage,
  setRefundsItemsPerPage,
  clearRefundsFilters,
} from "@/features/shared/searchFilterSlice";

const RefundsPage = () => {
  const dispatch = useAppDispatch();
  const { searchQuery, statusFilter, dateRange, currentPage, itemsPerPage } =
    useAppSelector((state) => state.searchFilter.refunds);

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
        <CardContent className="px-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <SearchBar
              placeholder="Search by user, course, or reason..."
              searchQuery={searchQuery}
              onSearchChange={(query) => dispatch(setRefundsSearchQuery(query))}
            />
            <div className="lg:flex-1 lg:max-w-none">
              <FilterBar
                statusFilter={statusFilter}
                dateRange={dateRange}
                searchQuery={searchQuery}
                onStatusFilterChange={(status) =>
                  dispatch(setRefundsStatusFilter(status))
                }
                onDateRangeChange={(range) =>
                  dispatch(setRefundsDateRange(range))
                }
                onClearFilters={() => dispatch(clearRefundsFilters())}
              />
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

            {/* Pagination */}
            {totalElements > 0 && (
              <Card className="py-0">
                <CardContent className="px-4">
                  <Pagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    pageInfo={data?.data?.page || null}
                    onPageChange={(page) =>
                      dispatch(setRefundsCurrentPage(page))
                    }
                    onItemsPerPageChange={(items) =>
                      dispatch(setRefundsItemsPerPage(items))
                    }
                  />
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RefundsPage;
