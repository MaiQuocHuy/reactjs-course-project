import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, Shield } from "lucide-react";
import type { Role } from "../../types/roles";
import { formatDistanceToNow } from "date-fns";

// Helper function to safely format date
const formatCreatedAt = (dateString: string): string => {
  if (!dateString) return "No date";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return "Invalid date";
  }
};

interface RoleTableProps {
  roles: Role[];
  onView: (roleId: string) => void;
  onEdit: (roleId: string) => void;
  onDelete: (roleId: string) => void;
  onNavigateToPermissions: (roleId: string) => void;
  isLoading?: boolean;
}

export const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  onView,
  onEdit,
  onDelete,
  onNavigateToPermissions,
  isLoading = false,
}) => {
  const getStatusBadge = (status: string) => {
    return (
      <Badge
        variant={status === "ACTIVE" ? "default" : "secondary"}
        className={
          status === "ACTIVE"
            ? "bg-green-100 text-green-800 hover:bg-green-100"
            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
        }
      >
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="text-center py-8">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No roles found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new role.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[130px]">Permissions</TableHead>
              <TableHead className="w-[120px]">Created</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {role.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {role.id.slice(0, 8)}...
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[300px] truncate text-gray-600">
                    {role.description || "No description"}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(role.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigateToPermissions(role.id)}
                      className="text-xs"
                    >
                      Assign permissions
                    </Button>
                    <Badge variant="secondary" className="text-xs">
                      {role.permissionCount}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {formatCreatedAt(role.createdAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onView(role.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(role.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit role
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onNavigateToPermissions(role.id)}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Permissions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(role.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
