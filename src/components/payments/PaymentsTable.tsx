import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentRow } from "./PaymentRow";
import { EmptyState } from "./EmptyState";
import { useAppSelector } from "@/hooks/redux";

export const PaymentsTable = () => {
  const {
    filteredPayments,
    currentPage,
    itemsPerPage,
    loading,
    searchQuery,
    statusFilter,
    paymentMethodFilter,
    dateRange,
  } = useAppSelector((state) => state.payments);

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  // Check if there are any active filters
  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "ALL" ||
    paymentMethodFilter !== "ALL" ||
    dateRange.from !== null ||
    dateRange.to !== null;

  if (loading) {
    return (
      <Card className="shadow-sm border-0 bg-card">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            <div className="text-center">
              <p className="text-sm font-medium">Loading payments...</p>
              <p className="text-xs text-muted-foreground mt-1">
                Please wait while we fetch the payment data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (paginatedPayments.length === 0) {
    return <EmptyState type={hasActiveFilters ? "no-results" : "no-data"} />;
  }

  return (
    <Card className="shadow-sm border-0 bg-card">
      <CardContent className="p-0">
        <div className="rounded-lg overflow-hidden border border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/70 transition-colors">
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">
                  Payment ID
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">
                  User
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">
                  Course
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">
                  Amount
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">
                  Method
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">
                  Date
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((payment, index) => (
                <PaymentRow
                  key={payment.id}
                  payment={payment}
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
