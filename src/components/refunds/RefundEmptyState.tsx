import { Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch } from "@/hooks/redux";
import { clearFilters } from "@/features/refunds/refundsSlice";

interface RefundEmptyStateProps {
  type: "no-data" | "no-results";
}

export const RefundEmptyState = ({ type }: RefundEmptyStateProps) => {
  const dispatch = useAppDispatch();

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  if (type === "no-data") {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No refunds found</h3>
          <p className="text-muted-foreground mb-4 max-w-sm">
            When refund requests are submitted, they will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <Search className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No results found</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">
          No refunds match your current search criteria. Try adjusting your
          filters.
        </p>
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="transition-colors hover:bg-muted"
        >
          Clear filters
        </Button>
      </CardContent>
    </Card>
  );
};
