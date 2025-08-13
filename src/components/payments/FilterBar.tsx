import { Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  setStatusFilter,
  setPaymentMethodFilter,
  setDateRange,
  clearFilters,
} from "@/features/payments/paymentsSlice";

export const FilterBar = () => {
  const dispatch = useAppDispatch();
  const { statusFilter, paymentMethodFilter, dateRange, searchQuery } =
    useAppSelector((state) => state.payments);

  const hasActiveFilters =
    statusFilter !== "ALL" ||
    paymentMethodFilter !== "ALL" ||
    dateRange.from ||
    dateRange.to ||
    searchQuery;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-muted/30 rounded-lg border border-border/50">
      <div className="flex flex-wrap gap-3">
        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={(value: typeof statusFilter) =>
            dispatch(setStatusFilter(value))
          }
        >
          <SelectTrigger className="w-[140px] transition-all duration-200 hover:bg-muted/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Method Filter */}
        <Select
          value={paymentMethodFilter}
          onValueChange={(value: typeof paymentMethodFilter) =>
            dispatch(setPaymentMethodFilter(value))
          }
        >
          <SelectTrigger className="w-[150px] transition-all duration-200 hover:bg-muted/50">
            <SelectValue placeholder="Payment Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Methods</SelectItem>
            <SelectItem value="stripe">Stripe</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-start text-left font-normal transition-all duration-200 hover:bg-muted/50"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {dateRange.from && dateRange.to ? (
                <>
                  {new Date(dateRange.from).toLocaleDateString()} -{" "}
                  {new Date(dateRange.to).toLocaleDateString()}
                </>
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-from">From</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={dateRange.from || ""}
                  onChange={(e) =>
                    dispatch(
                      setDateRange({
                        from: e.target.value || null,
                        to: dateRange.to,
                      })
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-to">To</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={dateRange.to || ""}
                  onChange={(e) =>
                    dispatch(
                      setDateRange({
                        from: dateRange.from,
                        to: e.target.value || null,
                      })
                    )
                  }
                />
              </div>
              {(dateRange.from || dateRange.to) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    dispatch(setDateRange({ from: null, to: null }))
                  }
                  className="w-full"
                >
                  Clear dates
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters and Clear Button */}
      <div className="flex flex-col items-center gap-2">
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(clearFilters())}
            className="h-8 px-2 lg:px-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
};
