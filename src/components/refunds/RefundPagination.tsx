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
} from "@/features/refunds/refundsSlice";

export const RefundPagination = () => {
  const dispatch = useAppDispatch();
  const { currentPage, totalPages, itemsPerPage, filteredRefunds } =
    useAppSelector((state) => state.refunds);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredRefunds.length);
  const totalItems = filteredRefunds.length;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
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

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
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
            <span className="font-medium text-foreground">{totalItems}</span> of{" "}
            <span className="font-medium text-foreground">{totalItems}</span>{" "}
            refund{totalItems !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">Rows per page</p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 px-4 py-6 bg-card border-t border-border/50">
      {/* Items info and per page selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">{startItem}</span> to{" "}
            <span className="font-medium text-foreground">{endItem}</span> of{" "}
            <span className="font-medium text-foreground">{totalItems}</span>{" "}
            refund{totalItems !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">Rows per page</p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2">
          {/* First page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(1)}
            disabled={!canGoPrevious}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={!canGoPrevious}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`dots-${index}`}
                    className="px-2 py-1 text-sm text-muted-foreground"
                  >
                    ...
                  </span>
                );
              }

              const pageNumber = page as number;
              const isCurrentPage = pageNumber === currentPage;

              return (
                <Button
                  key={pageNumber}
                  variant={isCurrentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNumber)}
                  className={`h-8 w-8 p-0 ${
                    isCurrentPage
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          {/* Next page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={!canGoNext}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(totalPages)}
            disabled={!canGoNext}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Page info */}
      <div className="flex justify-center">
        <p className="text-xs text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
      </div>
    </div>
  );
};
