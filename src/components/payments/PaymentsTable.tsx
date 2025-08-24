import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentRow } from "./PaymentRow";
import { EmptyState } from "../shared/EmptyState";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useGetPaymentsQuery } from "@/services/paymentsApi";
import { clearPaymentsFilters } from "@/features/shared/searchFilterSlice";

export const PaymentsTable = () => {
  const {
    searchQuery,
    statusFilter,
    paymentMethodFilter,
    dateRange,
    currentPage,
    itemsPerPage,
  } = useAppSelector((state) => state.searchFilter.payments);

  const dispatch = useAppDispatch();

  const { data, isLoading, error } = useGetPaymentsQuery({
    page: currentPage,
    size: itemsPerPage,
  });

  // Check if there are any active filters
  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "ALL" ||
    paymentMethodFilter !== "ALL" ||
    dateRange.from !== null ||
    dateRange.to !== null;

  if (isLoading) {
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

  if (error) {
    return (
      <Card className="shadow-sm border-0 bg-card">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-red-500 font-medium">Failed to load payments</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please try again later
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const allPayments = data?.data?.content || [];

  // Client-side filtering since API doesn't support server-side filtering
  const filteredPayments = allPayments.filter((payment) => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        payment.id?.toLowerCase().includes(searchLower) ||
        payment.user?.name?.toLowerCase().includes(searchLower) ||
        payment.course?.title?.toLowerCase().includes(searchLower) ||
        payment.user?.name?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== "ALL" && payment.status !== statusFilter) {
      return false;
    }

    // Payment method filter
    if (
      paymentMethodFilter !== "ALL" &&
      payment.paymentMethod !== paymentMethodFilter
    ) {
      return false;
    }

    // Date range filter
    if (dateRange.from || dateRange.to) {
      const paymentDate = new Date(payment.createdAt);

      if (dateRange.from && paymentDate < new Date(dateRange.from)) {
        return false;
      }

      if (dateRange.to && paymentDate > new Date(dateRange.to + " 23:59:59")) {
        return false;
      }
    }

    return true;
  });

  if (filteredPayments.length === 0) {
    return (
      <EmptyState
        type={hasActiveFilters ? "no-results" : "no-data"}
        clearFilters={() => dispatch(clearPaymentsFilters())}
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
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Payment ID
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  User
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Course
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-end">
                  Amount
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Method
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide w-[160px]">
                  Dates
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment, index) => (
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
