import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setSearchQuery } from "@/features/refunds/refundsSlice";
import { useDebounce } from "@/hooks/useDebounce";
import { useState, useEffect } from "react";

export const RefundSearchBar = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.refunds.searchQuery);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  // Update Redux when debounced value changes
  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearchQuery));
  }, [debouncedSearchQuery, dispatch]);

  // Sync local state with Redux state (for external updates)
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleClear = () => {
    setLocalSearchQuery("");
    dispatch(setSearchQuery(""));
  };

  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search by user, course, or reason..."
        value={localSearchQuery}
        onChange={(e) => setLocalSearchQuery(e.target.value)}
        className="pl-10 pr-10 transition-all duration-200 focus:shadow-md focus:ring-2 focus:ring-primary/20"
      />
      {localSearchQuery && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-muted rounded-full transition-colors"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
      {localSearchQuery !== debouncedSearchQuery && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};
