import React from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { X } from "lucide-react";

interface RoleFilterBarProps {
  statusFilter: "ALL" | "ACTIVE" | "INACTIVE";
  onStatusChange: (status: "ALL" | "ACTIVE" | "INACTIVE") => void;
  onClearFilters: () => void;
}

export const RoleFilterBar: React.FC<RoleFilterBarProps> = ({
  statusFilter,
  onStatusChange,
  onClearFilters,
}) => {
  const hasFilters = statusFilter !== "ALL";

  return (
    <div className="flex items-center space-x-2">
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Status</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="INACTIVE">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-8 px-2 lg:px-3"
        >
          Clear
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
