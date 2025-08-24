import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { RefundRow } from "./RefundRow";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useGetRefundsQuery } from "@/services/refundsApi";
import { EmptyState } from "../shared/EmptyState";
import { clearRefundsFilters } from "@/features/shared/searchFilterSlice";

export const RefundsTable = () => {
  const { searchQuery, statusFilter, dateRange, currentPage, itemsPerPage } =
    useAppSelector((state) => state.searchFilter.refunds);

  const { data, isLoading, error } = useGetRefundsQuery({
    page: currentPage,
    size: itemsPerPage,
  });

  const dispatch = useAppDispatch();

  // Check if there are any active filters
  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "ALL" ||
    dateRange.from !== null ||
    dateRange.to !== null;

  if (isLoading) {
    return (
      <Card className="shadow-sm border-0 bg-card">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            <div className="text-center">
              <p className="text-sm font-medium">Loading refunds...</p>
              <p className="text-xs text-muted-foreground mt-1">
                Please wait while we fetch the refund data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-sm border-0 bg-card">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-red-500 font-medium">Failed to load refunds</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please try again later
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const allRefunds = data?.data?.content || [];

  // Client-side filtering (API doesn't support server-side search/filter)
  const filteredRefunds = allRefunds.filter((refund) => {
    // Search: match id, payment id, or reason
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        refund.id.toLowerCase().includes(searchLower) ||
        refund.payment.user.name.toLowerCase().includes(searchLower) ||
        refund.payment?.id?.toLowerCase().includes(searchLower) ||
        refund.reason?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== "ALL" && refund.status !== statusFilter) {
      return false;
    }

    // Date range filter (use requestedAt)
    if (dateRange.from || dateRange.to) {
      const refundDate = new Date(refund.requestedAt);
      if (dateRange.from && refundDate < new Date(dateRange.from)) {
        return false;
      }
      if (dateRange.to && refundDate > new Date(dateRange.to + " 23:59:59")) {
        return false;
      }
    }

    return true;
  });

  if (filteredRefunds.length === 0) {
    return (
      <EmptyState
        type={hasActiveFilters ? "no-results" : "no-data"}
        clearFilters={() => dispatch(clearRefundsFilters())}
      />
    );
  }

  return (
    <Card className="shadow-sm border-0 bg-card py-0">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/50">
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Refund ID
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  User
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-end">
                  Refund
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-end">
                  Payment
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Reason
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Rejected Reason
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Dates
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide ">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRefunds.map((refund, index) => (
                <RefundRow
                  key={refund.id}
                  refund={refund}
                  style={{ animationDelay: `${index * 50}ms` }}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
