import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { SearchBar } from "../../../components/admin/SearchBar";
import {
  PermissionGate,
  PermissionButton,
} from "../../../components/shared/PermissionComponents";
import { Users, UserCog, Check, X } from "lucide-react";
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} from "../../../services/usersApi";
import { useGetRolesListQuery } from "../../../services/rolesApi";
import type { User } from "../../../types/users";
import type { Role } from "../../../services/rolesApi";
import { toast } from "sonner";

interface AssignRoleDialogProps {
  user: User;
  roles: Role[];
  onAssignRole: (userId: string, role: string) => void;
  isLoading: boolean;
}

const AssignRoleDialog: React.FC<AssignRoleDialogProps> = ({
  user,
  roles,
  onAssignRole,
  isLoading,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAssignRole = () => {
    if (selectedRole) {
      onAssignRole(user.id, selectedRole);
      setIsOpen(false);
      setSelectedRole("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <PermissionButton
          permissions={["user:UPDATE"]}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3"
        >
          <UserCog className="h-4 w-4 mr-1" />
          Assign Role
        </PermissionButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Role to User</DialogTitle>
          <DialogDescription>
            Assign a new role to {user.name} ({user.email})
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Current Role:</label>
            <Badge variant="secondary" className="ml-2">
              {user.role || "No Role"}
            </Badge>
          </div>

          <div>
            <label className="text-sm font-medium">Select New Role:</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a role..." />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={handleAssignRole}
              disabled={!selectedRole || isLoading}
            >
              <Check className="h-4 w-4 mr-1" />
              {isLoading ? "Assigning..." : "Assign Role"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
interface LocalFilters {
  search: string;
  role: string;
  status: string;
}

export const AssignRoleToUsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<LocalFilters>({
    search: "",
    role: "ALL",
    status: "ALL",
  });

  // API calls - Get all users without pagination for custom role assignment
  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    refetch: refetchUsers,
  } = useGetUsersQuery({
    search: searchQuery,
    role: filters.role !== "ALL" ? filters.role : undefined,
    isActive:
      filters.status === "ACTIVE"
        ? true
        : filters.status === "INACTIVE"
        ? false
        : undefined,
    page: 0,
    size: 100, // Reasonable size to avoid server errors
  });

  const { data: rolesResponse, isLoading: isRolesLoading } =
    useGetRolesListQuery();

  const [updateUserRole, { isLoading: isUpdating }] =
    useUpdateUserRoleMutation();

  const users = usersResponse?.data?.users || [];
  const totalElements = usersResponse?.data?.totalElements || 0;
  const roles = rolesResponse?.data || [];

  // Filter users to exclude main system roles (ADMIN, INSTRUCTOR, STUDENT)
  const filteredUsers = users.filter((user: User) => {
    const userRole = user.role?.toUpperCase();
    return !["ADMIN", "INSTRUCTOR", "STUDENT"].includes(userRole || "");
  });

  // Filter roles to exclude main system roles from assignment dropdown
  const assignableRoles = roles.filter((role: Role) => {
    const roleName = role.name?.toUpperCase();
    return !["ADMIN", "INSTRUCTOR", "STUDENT"].includes(roleName || "");
  });

  // Handle role assignment
  const handleAssignRole = async (userId: string, roleValue: string) => {
    try {
      // Find the role in our available assignable roles to validate
      const selectedRole = assignableRoles.find(
        (role) => role.name === roleValue
      );
      if (!selectedRole) {
        toast.error("Invalid role selected");
        return;
      }

      await updateUserRole({
        id: userId,
        data: { role: roleValue as "ADMIN" | "INSTRUCTOR" | "STUDENT" },
      }).unwrap();

      toast.success(`Role "${roleValue}" assigned successfully!`);

      // Refresh the users list to show updated role
      refetchUsers();
    } catch (error: any) {
      console.error("Failed to assign role:", error);
      toast.error(error?.data?.message || "Failed to assign role");
    }
  };

  return (
    <PermissionGate permissions={["user:READ"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Assign Roles to Users
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage user roles and permissions by assigning custom roles to
              users
            </p>
            <p className="text-sm text-orange-600 mt-1">
              Note: Only users with custom roles are shown. Users with ADMIN,
              INSTRUCTOR, or STUDENT roles are excluded.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              Total Users: {totalElements}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              Custom Role Users: {filteredUsers.length}
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search users by name or email..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1">
                {/* Custom Filter for Assign Role Page */}
                <div className="flex items-center space-x-4">
                  <Select
                    value={filters.role}
                    onValueChange={(role) =>
                      setFilters((prev: LocalFilters) => ({ ...prev, role }))
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Roles</SelectItem>
                      {assignableRoles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.status}
                    onValueChange={(status) =>
                      setFilters((prev: LocalFilters) => ({ ...prev, status }))
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  {(filters.role !== "ALL" || filters.status !== "ALL") && (
                    <div className="flex items-center space-x-2">
                      {filters.role !== "ALL" && (
                        <Badge variant="secondary" className="px-2 py-1">
                          Role: {filters.role}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() =>
                              setFilters((prev: LocalFilters) => ({
                                ...prev,
                                role: "ALL",
                              }))
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )}
                      {filters.status !== "ALL" && (
                        <Badge variant="secondary" className="px-2 py-1">
                          Status: {filters.status}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() =>
                              setFilters((prev: LocalFilters) => ({
                                ...prev,
                                status: "ALL",
                              }))
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setFilters({ search: "", role: "ALL", status: "ALL" })
                        }
                        className="text-muted-foreground"
                      >
                        Clear all
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isUsersLoading || isRolesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading users...</p>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No users with custom roles found
                </h3>
                <p className="text-gray-500">
                  {users.length > 0
                    ? "All users have system roles (ADMIN, INSTRUCTOR, STUDENT). Only users with custom roles can be assigned new roles here."
                    : "Try adjusting your search or filter criteria"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Users Grid */}
                <div className="grid gap-4">
                  {filteredUsers.map((user: User) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user.thumbnailUrl}
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            Current Role:
                          </div>
                          <Badge
                            variant={
                              user.role === "ADMIN"
                                ? "default"
                                : user.role === "INSTRUCTOR"
                                ? "secondary"
                                : "outline"
                            }
                            className="mt-1"
                          >
                            {user.role || "No Role"}
                          </Badge>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-medium">Status:</div>
                          <Badge
                            variant={user.isActive ? "active" : "destructive"}
                            className="mt-1"
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        <AssignRoleDialog
                          user={user}
                          roles={assignableRoles}
                          onAssignRole={handleAssignRole}
                          isLoading={isUpdating}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="text-center text-sm text-gray-500 pt-4">
                  Showing {filteredUsers.length} users with custom roles
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
};
