import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  setCurrentPage,
  setItemsPerPage,
} from "@/features/payments/paymentsSlice";
import { useGetPaymentsQuery } from "@/services/paymentsApi";

export const Pagination = () => {
  const dispatch = useAppDispatch();
  const { currentPage, itemsPerPage } = useAppSelector(
    (state) => state.payments
  );
  const { data } = useGetPaymentsQuery({
    page: currentPage,
    size: itemsPerPage,
  });

  const pageInfo = data?.data?.page;
  if (!pageInfo) return null;

  const totalPages = pageInfo.totalPages;
  const totalElements = pageInfo.totalElements;
  const startItem = currentPage * itemsPerPage + 1;
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalElements);

  const canGoPrevious = !pageInfo.first;
  const canGoNext = !pageInfo.last;

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    dispatch(setItemsPerPage(parseInt(value)));
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    const displayCurrentPage = currentPage + 1; // Convert to 1-based for display

    for (
      let i = Math.max(2, displayCurrentPage - delta);
      i <= Math.min(totalPages - 1, displayCurrentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (displayCurrentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (displayCurrentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between px-4 py-6 bg-card border-t border-border/50">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">{totalElements}</span>{" "}
            of{" "}
            <span className="font-medium text-foreground">{totalElements}</span>{" "}
            result
            {totalElements !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px] hover:bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 px-4 py-6 bg-card border-t border-border/50">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {startItem}-{endItem}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">{totalElements}</span>{" "}
          result
          {totalElements !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px] hover:bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(0)}
            disabled={!canGoPrevious}
            className="h-8 w-8 p-0 hover:bg-muted/50"
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={!canGoPrevious}
            className="h-8 w-8 p-0 hover:bg-muted/50"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-1">
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={page === currentPage + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage((page as number) - 1)} // Convert back to 0-based
                  className="h-8 w-8 p-0 hover:bg-muted/50"
                >
                  {page}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={!canGoNext}
            className="h-8 w-8 p-0 hover:bg-muted/50"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(totalPages - 1)}
            disabled={!canGoNext}
            className="h-8 w-8 p-0 hover:bg-muted/50"
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
