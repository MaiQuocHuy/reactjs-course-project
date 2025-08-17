import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import type { UserRole, UserStatus } from "../../types/users";

interface FilterBarProps {
  roleFilter: UserRole | "ALL";
  statusFilter: UserStatus | "ALL";
  onRoleChange: (role: UserRole | "ALL") => void;
  onStatusChange: (status: UserStatus | "ALL") => void;
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  roleFilter,
  statusFilter,
  onRoleChange,
  onStatusChange,
  onClearFilters,
}) => {
  const hasActiveFilters = roleFilter !== "ALL" || statusFilter !== "ALL";

  return (
    <div className="flex items-center space-x-4">
      <Select value={roleFilter} onValueChange={onRoleChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Roles</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
          <SelectItem value="STUDENT">Student</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Status</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="BANNED">Banned</SelectItem>
          <SelectItem value="INACTIVE">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <div className="flex items-center space-x-2">
          {roleFilter !== "ALL" && (
            <Badge variant="secondary" className="px-2 py-1">
              Role: {roleFilter}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => onRoleChange("ALL")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {statusFilter !== "ALL" && (
            <Badge variant="secondary" className="px-2 py-1">
              Status: {statusFilter}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => onStatusChange("ALL")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};
