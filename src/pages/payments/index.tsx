import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/payments/SearchBar";
import { FilterBar } from "@/components/payments/FilterBar";
import { PaymentsTable } from "@/components/payments/PaymentsTable";
import { Pagination } from "@/components/payments/Pagination";
import { useAppSelector } from "@/hooks/redux";
import { useGetPaymentsQuery } from "@/services/paymentsApi";

export const PaymentsPage = () => {
  const { currentPage, itemsPerPage } = useAppSelector(
    (state) => state.payments
  );
  const { data } = useGetPaymentsQuery({
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
        {totalElements > 0 && (
          <Card className="py-0">
            <CardContent className="px-4">
              <Pagination />
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
