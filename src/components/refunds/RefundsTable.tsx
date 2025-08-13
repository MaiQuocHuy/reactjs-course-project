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

export const RefundsTable = () => {
  const {
    filteredRefunds,
    currentPage,
    itemsPerPage,
    loading,
    searchQuery,
    statusFilter,
    dateRange,
  } = useAppSelector((state) => state.refunds);

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRefunds = filteredRefunds.slice(startIndex, endIndex);

  // Check if there are any active filters
  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "ALL" ||
    dateRange.from !== null ||
    dateRange.to !== null;

  if (loading) {
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

  if (paginatedRefunds.length === 0) {
    return (
      <RefundEmptyState type={hasActiveFilters ? "no-results" : "no-data"} />
    );
  }

  return (
    <Card className="shadow-sm border-0 bg-card">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/50">
                <TableHead className="w-[100px] font-semibold">ID</TableHead>
                <TableHead className="min-w-[180px] font-semibold">
                  Student
                </TableHead>
                <TableHead className="min-w-[200px] font-semibold">
                  Course
                </TableHead>
                <TableHead className="w-[120px] font-semibold">
                  Amount
                </TableHead>
                <TableHead className="w-[100px] font-semibold">
                  Payment Method
                </TableHead>
                <TableHead className="w-[100px] font-semibold">
                  Status
                </TableHead>
                <TableHead className="min-w-[200px] font-semibold">
                  Reason
                </TableHead>
                <TableHead className="w-[140px] font-semibold">Date</TableHead>
                <TableHead className="w-[60px] text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRefunds.map((refund) => (
                <RefundRow key={refund.id} refund={refund} />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
