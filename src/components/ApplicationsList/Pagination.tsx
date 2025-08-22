import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
  <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
    <div className="flex justify-between flex-1 sm:hidden">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
      >
        Previous
      </Button>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
      >
        Next
      </Button>
    </div>
    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-gray-700">
          Showing page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div className="flex space-x-1">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {[...Array(Math.min(5, totalPages))].map((_, i) => {
          const page = i + 1;
          return (
            <Button
              key={page}
              onClick={() => onPageChange(page)}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
            >
              {page}
            </Button>
          );
        })}
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);
