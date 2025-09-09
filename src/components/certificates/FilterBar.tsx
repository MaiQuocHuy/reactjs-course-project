import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { useCourses, useUsers } from "@/hooks/useCertificates";
import type { CertificateFilters, FilterMode } from "@/types/certificates";

interface FilterBarProps {
  filters: CertificateFilters;
  onFilterChange: (updates: Partial<CertificateFilters>) => void;
  isLoading: boolean;
}

export function FilterBar({ filters, onFilterChange, isLoading }: FilterBarProps) {
  const [localSearch, setLocalSearch] = useState(filters.search);

  const { courses, isLoading: isLoadingCourses } = useCourses();
  const { users, isLoading: isLoadingUsers } = useUsers();

  // Convert courses to combobox options
  const courseOptions: ComboboxOption[] = useMemo(
    () =>
      courses.map((course) => ({
        value: course.id,
        label: course.title,
        subtitle: `by ${
          typeof course.instructor === "object" ? course.instructor.name : course.instructor
        }`,
      })),
    [courses]
  );

  // Convert users to combobox options
  const userOptions: ComboboxOption[] = useMemo(
    () =>
      users.map((user) => ({
        value: user.id,
        label: user.name,
        subtitle: user.email,
      })),
    [users]
  );

  // Sync local search with filters
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  // Update search with debouncing - handled by useCertificates hook
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFilterChange({ search: localSearch });
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [localSearch, filters.search, onFilterChange]);

  const handleModeChange = (mode: FilterMode) => {
    onFilterChange({
      mode,
      search: "",
      selectedCourseId: "",
      selectedUserId: "",
    });
    setLocalSearch("");
  };

  const handleCourseChange = (courseId: string) => {
    onFilterChange({ selectedCourseId: courseId });
  };

  const handleUserChange = (userId: string) => {
    onFilterChange({ selectedUserId: userId });
  };

  const handleClearFilters = () => {
    onFilterChange({
      mode: "all",
      search: "",
      selectedCourseId: "",
      selectedUserId: "",
    });
    setLocalSearch("");
  };

  const hasActiveFilters =
    filters.mode !== "all" ||
    filters.search !== "" ||
    filters.selectedCourseId !== "" ||
    filters.selectedUserId !== "";

  return (
    <div className="space-y-4">
      {/* Mode Selection */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">View:</span>
          <div className="flex space-x-1">
            {(["all", "course", "user"] as FilterMode[]).map((mode) => (
              <Button
                key={mode}
                variant={filters.mode === mode ? "default" : "outline"}
                size="sm"
                onClick={() => handleModeChange(mode)}
                disabled={isLoading}
                className="capitalize"
              >
                {mode === "all" ? "All Certificates" : `By ${mode}`}
              </Button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Search and Dropdowns */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search - only for "all" mode */}
        {filters.mode === "all" && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search certificates..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              disabled={isLoading}
              className="pl-10"
            />
          </div>
        )}

        {/* Course Dropdown - only for "course" mode */}
        {filters.mode === "course" && (
          <div className="flex-1 max-w-sm">
            {isLoadingCourses ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Combobox
                options={courseOptions}
                value={filters.selectedCourseId}
                onValueChange={handleCourseChange}
                placeholder="Select a course"
                searchPlaceholder="Search courses..."
                emptyText="No courses found"
                disabled={isLoading}
              />
            )}
          </div>
        )}

        {/* User Dropdown - only for "user" mode */}
        {filters.mode === "user" && (
          <div className="flex-1 max-w-sm">
            {isLoadingUsers ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Combobox
                options={userOptions}
                value={filters.selectedUserId}
                onValueChange={handleUserChange}
                placeholder="Select a student"
                searchPlaceholder="Search students..."
                emptyText="No students found"
                disabled={isLoading}
              />
            )}
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {filters.mode !== "all" && (
            <Badge variant="secondary" className="capitalize">
              Mode: {filters.mode}
            </Badge>
          )}

          {filters.search && <Badge variant="secondary">Search: "{filters.search}"</Badge>}

          {filters.selectedCourseId && (
            <Badge variant="secondary">
              Course:{" "}
              {courseOptions.find((c) => c.value === filters.selectedCourseId)?.label || "Unknown"}
            </Badge>
          )}

          {filters.selectedUserId && (
            <Badge variant="secondary">
              User:{" "}
              {userOptions.find((u) => u.value === filters.selectedUserId)?.label || "Unknown"}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
