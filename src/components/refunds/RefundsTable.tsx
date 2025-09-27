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
import { TableLoadingSkeleton } from "../shared/LoadingSkeleton";
import { TableLoadingError } from "../shared/LoadingError";

export const RefundsTable = () => {
  const { searchQuery, statusFilter, dateRange, currentPage, itemsPerPage } =
    useAppSelector((state) => state.searchFilter.refunds);

  const { data, isLoading, error, refetch } = useGetRefundsQuery({
    search: searchQuery || undefined,
    status:
      statusFilter !== "ALL"
        ? (statusFilter as "PENDING" | "COMPLETED" | "FAILED")
        : undefined,
    fromDate: dateRange.from || undefined,
    toDate: dateRange.to || undefined,
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
    return <TableLoadingSkeleton />;
  }

  if (error) {
    return <TableLoadingError onRetry={() => refetch()} />;
  }

  const allRefunds = data?.data?.content || [];

  if (allRefunds.length === 0) {
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
        <div className="rounded-lg overflow-hidden border border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/70 transition-colors">
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-end">
                  No.
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Refund ID
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  User
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-end">
                  Amount
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
                  Requested
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Processed
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide ">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allRefunds.map((refund, index) => (
                <RefundRow
                  key={refund.id}
                  refund={refund}
                  index={index}
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
