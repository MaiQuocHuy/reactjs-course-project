import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { RefundRow } from "./RefundRow";
import { RefundEmptyState } from "./RefundEmptyState";
import { useAppSelector } from "@/hooks/redux";
import { useGetRefundsQuery } from "@/services/refundsApi";

export const RefundsTable = () => {
  const { searchQuery, statusFilter, dateRange, currentPage, itemsPerPage } =
    useAppSelector((state) => state.refunds);

  const { data, isLoading, error } = useGetRefundsQuery({
    page: currentPage,
    size: itemsPerPage,
  });

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

  const refunds = data?.data?.content || [];

  if (refunds.length === 0) {
    return (
      <RefundEmptyState type={hasActiveFilters ? "no-results" : "no-data"} />
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
                  Payment ID
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
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refunds.map((refund, index) => (
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
