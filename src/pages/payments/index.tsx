import { Card, CardContent } from "@/components/ui/card";
import { SearchBar, FilterBar, Pagination } from "@/components/shared";
import { PaymentsTable } from "@/components/payments/PaymentsTable";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { useGetPaymentsQuery } from "@/services/paymentsApi";
import {
  setPaymentsSearchQuery,
  setPaymentsStatusFilter,
  setPaymentsPaymentMethodFilter,
  setPaymentsDateRange,
  setPaymentsCurrentPage,
  setPaymentsItemsPerPage,
  clearPaymentsFilters,
} from "@/features/shared/searchFilterSlice";

export const PaymentsPage = () => {
  const dispatch = useAppDispatch();
  const {
    searchQuery,
    statusFilter,
    paymentMethodFilter,
    dateRange,
    currentPage,
    itemsPerPage,
  } = useAppSelector((state) => state.searchFilter.payments);

  const { data } = useGetPaymentsQuery({
    search: searchQuery || undefined,
    status:
      statusFilter !== "ALL"
        ? (statusFilter as "PENDING" | "COMPLETED" | "FAILED")
        : undefined,
    paymentMethod:
      paymentMethodFilter !== "ALL" ? paymentMethodFilter : undefined,
    fromDate: dateRange.from || undefined,
    toDate: dateRange.to || undefined,
    page: currentPage,
    size: itemsPerPage,
  });

  const totalElements = data?.data?.page?.totalElements || 0;

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
      <Card className="py-0">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <SearchBar
              placeholder="Search by payment id, user name or course title..."
              searchQuery={searchQuery}
              onSearchChange={(query) =>
                dispatch(setPaymentsSearchQuery(query))
              }
            />
            <div className="lg:flex-1 lg:max-w-none">
              <FilterBar
                statusFilter={statusFilter}
                dateRange={dateRange}
                searchQuery={searchQuery}
                paymentMethodFilter={paymentMethodFilter}
                onStatusFilterChange={(status) =>
                  dispatch(setPaymentsStatusFilter(status))
                }
                onPaymentMethodFilterChange={(method) =>
                  dispatch(setPaymentsPaymentMethodFilter(method))
                }
                onDateRangeChange={(range) =>
                  dispatch(setPaymentsDateRange(range))
                }
                onClearFilters={() => dispatch(clearPaymentsFilters())}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <div className="space-y-4">
        <PaymentsTable />

        {/* Pagination */}
        {totalElements > 0 && (
          <Card className="py-0">
            <CardContent className="px-4">
              <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                pageInfo={data?.data?.page || null}
                onPageChange={(page) => dispatch(setPaymentsCurrentPage(page))}
                onItemsPerPageChange={(items) =>
                  dispatch(setPaymentsItemsPerPage(items))
                }
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results Summary */}
      {totalElements > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Total {totalElements} payment{totalElements !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};
