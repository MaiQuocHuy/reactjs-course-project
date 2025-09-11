import { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  useGetAffiliatePayoutsQuery,
  useGetAffiliateStatisticsQuery,
  useMarkPayoutAsPaidMutation,
  useCancelPayoutMutation,
  useBulkActionPayoutsMutation,
  useExportPayoutsMutation,
  type PayoutParams,
} from "@/services/affiliateApi";
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  Calendar,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

const AffiliateRevenueManagementPage = () => {
  // State for filters and pagination
  const [filters, setFilters] = useState<PayoutParams>({
    page: 0,
    size: 20,
    sort: "createdAt",
    direction: "desc",
  });

  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [bulkActionDialog, setBulkActionDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // API hooks
  const {
    data: payoutsResponse,
    isLoading: payoutsLoading,
    refetch: refetchPayouts,
  } = useGetAffiliatePayoutsQuery(filters);

  const { data: statsResponse } = useGetAffiliateStatisticsQuery();

  const [markAsPaid] = useMarkPayoutAsPaidMutation();
  const [cancelPayout] = useCancelPayoutMutation();
  const [bulkAction] = useBulkActionPayoutsMutation();
  const [exportPayouts] = useExportPayoutsMutation();

  const payouts = payoutsResponse?.data?.content || [];
  const pagination = payoutsResponse?.data?.page || {
    number: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
  };
  const stats = statsResponse?.data;

  // Filtered payouts based on search
  const filteredPayouts = useMemo(() => {
    if (!searchTerm) return payouts;

    return payouts.filter(
      (payout) =>
        payout.referredByUser.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payout.referredByUser.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payout.course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payout.discountUsage?.discount.code
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [payouts, searchTerm]);

  // Handle filter changes
  const handleFilterChange = (key: keyof PayoutParams, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 0, // Reset to first page when filtering
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  // Handle single payout actions
  const handleMarkAsPaid = async (payoutId: string) => {
    try {
      await markAsPaid(payoutId).unwrap();
      toast.success("Payout marked as paid successfully");
      refetchPayouts();
    } catch (error) {
      toast.error("Failed to mark payout as paid");
    }
  };

  const handleCancelPayout = async (payoutId: string, reason?: string) => {
    try {
      await cancelPayout({ id: payoutId, reason }).unwrap();
      toast.success("Payout cancelled successfully");
      refetchPayouts();
    } catch (error) {
      toast.error("Failed to cancel payout");
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: "MARK_PAID" | "CANCEL") => {
    try {
      await bulkAction({
        payoutIds: selectedPayouts,
        action,
        reason: action === "CANCEL" ? cancelReason : undefined,
      }).unwrap();

      toast.success("Bulk action completed successfully");

      setSelectedPayouts([]);
      setCancelReason("");
      setBulkActionDialog(false);
      refetchPayouts();
    } catch (error) {
      toast.error("Failed to perform bulk action");
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      const result = await exportPayouts(filters).unwrap();

      // Create download link
      const url = window.URL.createObjectURL(new Blob([result]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `affiliate-payouts-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Payouts exported successfully");
    } catch (error) {
      toast.error("Failed to export payouts");
    }
  };

  // Apply date range filter
  const applyDateFilter = () => {
    handleFilterChange("startDate", dateRange.startDate);
    handleFilterChange("endDate", dateRange.endDate);
  };

  // Clear date range filter
  const clearDateFilter = () => {
    setDateRange({ startDate: "", endDate: "" });
    handleFilterChange("startDate", undefined);
    handleFilterChange("endDate", undefined);
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayouts(filteredPayouts.map((p) => p.id));
    } else {
      setSelectedPayouts([]);
    }
  };

  // Handle individual select
  const handleSelectPayout = (payoutId: string, checked: boolean) => {
    if (checked) {
      setSelectedPayouts((prev) => [...prev, payoutId]);
    } else {
      setSelectedPayouts((prev) => prev.filter((id) => id !== payoutId));
    }
  };

  // Get status variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "PAID":
        return "default";
      case "PENDING":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Revenue Management</h1>
          <p className="text-muted-foreground">
            Manage commission payouts and track affiliate performance
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={payoutsLoading}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          {selectedPayouts.length > 0 && (
            <Dialog open={bulkActionDialog} onOpenChange={setBulkActionDialog}>
              <DialogTrigger asChild>
                <Button>Bulk Actions ({selectedPayouts.length})</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Actions</DialogTitle>
                  <DialogDescription>
                    Perform actions on {selectedPayouts.length} selected payouts
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleBulkAction("MARK_PAID")}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Paid
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleBulkAction("CANCEL")}
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cancelReason">
                      Cancel Reason (Optional)
                    </Label>
                    <Textarea
                      id="cancelReason"
                      placeholder="Enter reason for cancellation..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Payouts
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPayouts}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(stats.totalCommissionAmount)} total value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Payouts
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPayouts}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(stats.pendingCommissionAmount)} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Paid Payouts
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.paidPayouts}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(stats.paidCommissionAmount)} paid out
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cancelledPayouts}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(stats.cancelledCommissionAmount)} cancelled
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users, courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "status",
                    value === "all" ? undefined : value
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={applyDateFilter} size="sm">
              Apply Date Filter
            </Button>
            <Button variant="outline" onClick={clearDateFilter} size="sm">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payouts Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Affiliate Payouts</CardTitle>
              <CardDescription>
                Showing {filteredPayouts.length} of {pagination.totalElements}{" "}
                payouts
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {pagination.number + 1} of {pagination.totalPages}
              </span>

              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.number - 1)}
                  disabled={pagination.number === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.number + 1)}
                  disabled={pagination.number >= pagination.totalPages - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        filteredPayouts.length > 0 &&
                        selectedPayouts.length === filteredPayouts.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Discount Code</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedPayouts.includes(payout.id)}
                        onCheckedChange={(checked) =>
                          handleSelectPayout(payout.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {payout.referredByUser.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {payout.referredByUser.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{payout.course.name}</div>
                    </TableCell>
                    <TableCell>
                      {payout.discountUsage ? (
                        <Badge variant="outline">
                          {payout.discountUsage.discount.code}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">
                          Direct referral
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{payout.commissionPercent}%</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(payout.commissionAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(payout.payoutStatus)}>
                        {payout.payoutStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(payout.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {payout.payoutStatus === "PENDING" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleMarkAsPaid(payout.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Paid
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCancelPayout(payout.id)}
                                className="text-destructive"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPayouts.length === 0 && !payoutsLoading && (
            <div className="text-center py-6">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No payouts found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No affiliate payouts match your current filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateRevenueManagementPage;
