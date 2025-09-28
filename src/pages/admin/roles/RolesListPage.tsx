import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Shield,
  UserPlus,
  RefreshCw,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  useGetRolesQuery,
  useDeleteRoleMutation,
  rolesApi,
} from "@/services/rolesApi";
import type { RoleWithPermissions } from "@/services/rolesApi";
import { CreateRoleDialog } from "./CreateRoleDialog";
import { CreateUserWithRoleDialog } from "./CreateUserWithRoleDialog";
import { EditRoleDialog } from "./EditRoleDialog";
import { ViewRoleDialog } from "./ViewRoleDialog";
import { DeleteRoleDialog } from "./DeleteRoleDialog";
import { RolePermissionsDialog } from "./RolePermissionsDialog";
import { AssignPermissionsDialog } from "./AssignPermissionsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const RolesListPage: React.FC = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createUserWithRoleDialogOpen, setCreateUserWithRoleDialogOpen] =
    useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [assignPermissionsDialogOpen, setAssignPermissionsDialogOpen] =
    useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(
    null
  );

  // API hooks
  const {
    data: rolesData,
    isLoading,
    error,
    refetch,
  } = useGetRolesQuery(
    { page, size },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );
  const [deleteRole] = useDeleteRoleMutation();

  const roles = rolesData?.data?.content || [];
  const totalPages = rolesData?.data?.totalPages || 0;
  const totalElements = rolesData?.data?.totalElements || 0;

  // Force refresh function to clear cache and refetch
  const forceRefreshRoles = async () => {
    try {
      dispatch(rolesApi.util.invalidateTags(["Role"]));
      await refetch();
      toast.success("Roles data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh roles data");
    }
  };

  // Helper function to check if role is protected (system role)
  const isProtectedRole = (roleName: string): boolean => {
    const protectedRoles = ["ADMIN", "INSTRUCTOR", "STUDENT"];
    return protectedRoles.includes(roleName.toUpperCase());
  };

  const handleEdit = (role: RoleWithPermissions) => {
    setSelectedRole(role);
    setEditDialogOpen(true);
  };

  const handleView = (role: RoleWithPermissions) => {
    // Clear previous selected role first to avoid showing stale data
    setSelectedRole(null);
    setViewDialogOpen(false);

    // Set new role and open dialog after a small delay to ensure state is clean
    setTimeout(() => {
      setSelectedRole(role);
      setViewDialogOpen(true);
    }, 10);
  };

  const handleViewPermissions = (role: RoleWithPermissions) => {
    // Clear previous selected role first to avoid showing stale data
    setSelectedRole(null);
    setPermissionsDialogOpen(false);

    // Set new role and open dialog after a small delay to ensure state is clean
    setTimeout(() => {
      setSelectedRole(role);
      setPermissionsDialogOpen(true);
    }, 10);
  };

  const handleAssignPermissions = (role: RoleWithPermissions) => {
    setSelectedRole(role);
    setAssignPermissionsDialogOpen(true);
  };

  const handleDelete = (role: RoleWithPermissions) => {
    // Check if role is protected before opening delete dialog
    if (isProtectedRole(role.name)) {
      toast.error(
        `Cannot delete system role: ${role.name}. This role is protected and required for system operation.`
      );
      return;
    }

    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRole) return;

    try {
      await deleteRole(selectedRole.id).unwrap();
      toast.success("Role deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedRole(null);
      refetch();
    } catch (error) {
      toast.error("Failed to delete role");
      console.error("Delete role error:", error);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading roles. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Roles Management
          </h1>
          <p className="text-muted-foreground">
            Manage user roles and their permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={forceRefreshRoles}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={() => setCreateUserWithRoleDialogOpen(true)}
            variant="outline"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User With Role
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalElements}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>A list of all roles in your system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Roles Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Permissions Count</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assign Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[60px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[40px] ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : roles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No roles found
                    </TableCell>
                  </TableRow>
                ) : (
                  roles
                    .filter((role: RoleWithPermissions) =>
                      role.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((role: RoleWithPermissions) => (
                      <TableRow
                        key={role.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewPermissions(role)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {role.name}
                            {isProtectedRole(role.name) && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-blue-100 text-blue-800"
                              >
                                System
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {role.permissions?.filter(
                              (p) => p.isActive !== false
                            )?.length || 0}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="active">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignPermissions(role);
                            }}
                            className="h-8"
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Assign
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleView(role);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewPermissions(role);
                                }}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                View Permissions
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(role);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(role);
                                }}
                                className={`${
                                  isProtectedRole(role.name)
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-red-600"
                                }`}
                                disabled={isProtectedRole(role.name)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                                {isProtectedRole(role.name) && (
                                  <span className="ml-2 text-xs">
                                    (Protected)
                                  </span>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {roles.length} of {totalElements} results
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateRoleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          refetch();
          setCreateDialogOpen(false);
        }}
      />

      <CreateUserWithRoleDialog
        open={createUserWithRoleDialogOpen}
        onOpenChange={setCreateUserWithRoleDialogOpen}
      />

      {selectedRole && (
        <>
          <EditRoleDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            role={selectedRole}
            onSuccess={() => {
              refetch();
              setEditDialogOpen(false);
              setSelectedRole(null);
            }}
          />

          <ViewRoleDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            roleId={selectedRole?.id || null}
          />

          <DeleteRoleDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            role={selectedRole}
            onConfirm={handleConfirmDelete}
          />

          <RolePermissionsDialog
            open={permissionsDialogOpen}
            onOpenChange={(open) => {
              setPermissionsDialogOpen(open);
              // Clear selected role when dialog closes to prevent stale data
              if (!open) {
                setSelectedRole(null);
              }
            }}
            roleId={selectedRole?.id || null}
            roleName={selectedRole?.name || ""}
          />

          <AssignPermissionsDialog
            open={assignPermissionsDialogOpen}
            onOpenChange={setAssignPermissionsDialogOpen}
            roleId={selectedRole?.id || null}
            roleName={selectedRole?.name || ""}
            onSuccess={forceRefreshRoles}
          />
        </>
      )}
    </div>
  );
};
