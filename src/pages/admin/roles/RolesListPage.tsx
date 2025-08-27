import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import { RoleTable } from "../../../components/admin/RoleTable";
import { SearchBar } from "../../../components/admin/SearchBar";
import { RoleFilterBar } from "../../../components/admin/RoleFilterBar";
import {
  AddRoleDialog,
  EditRoleDialog,
  ViewRoleDialog,
  DeleteRoleDialog,
  AssignPermissionsDialog,
} from "../../../components/admin/RoleDialogs";
import { Shield, Plus, RefreshCw } from "lucide-react";
import {
  useGetRolesQuery,
  // useGetRoleByIdQuery,
  useGetAllPermissionsQuery,
  useCreateRoleMutation,
  // useUpdateRoleMutation, // Not implemented yet
  // useDeleteRoleMutation, // Not implemented yet
  useAssignPermissionsMutation,
} from "../../../services/rolesApi";
import type { Role, RoleFilters } from "../../../types/roles/index";
import type {
  CreateRoleRequest,
  UpdateRoleRequest,
} from "../../../services/rolesApi";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export const RolesListPage: React.FC = () => {
  const navigate = useNavigate();

  // State for filters and pagination
  const [filters, setFilters] = useState<RoleFilters>({
    search: "",
    status: "ALL",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(ITEMS_PER_PAGE);

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignPermissionsDialogOpen, setAssignPermissionsDialogOpen] =
    useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // API hooks
  const {
    data: rolesResponse,
    isLoading,
    error,
    refetch,
  } = useGetRolesQuery({
    search: filters.search || undefined,
    page: currentPage,
    size: pageSize,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  const { data: allPermissionsResponse } = useGetAllPermissionsQuery();
  // const { data: roleDetailsResponse } = useGetRoleByIdQuery(
  //   selectedRole?.id || "",
  //   {
  //     skip: !selectedRole?.id,
  //   }
  // );

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  // const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation(); // Not implemented yet
  // const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation(); // Not implemented yet
  const [assignPermissions, { isLoading: isAssigning }] =
    useAssignPermissionsMutation();

  const roles = rolesResponse?.data?.content || [];
  const totalPages = rolesResponse?.data?.totalPages || 0;
  const totalElements = rolesResponse?.data?.totalElements || 0;
  const allPermissions = allPermissionsResponse?.data || [];
  // const roleWithPermissions = roleDetailsResponse?.data;

  // Statistics calculations
  const activeRolesCount = roles.filter((r) => r.status === "ACTIVE").length;
  const totalPermissionsCount = allPermissions.length;

  // Handlers
  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setCurrentPage(0);
  };

  const handleStatusChange = (status: "ALL" | "ACTIVE" | "INACTIVE") => {
    setFilters((prev) => ({ ...prev, status }));
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setFilters({ search: "", status: "ALL" });
    setCurrentPage(0);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Roles refreshed!");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Role actions
  const handleView = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    setSelectedRole(role || null);
    setViewDialogOpen(true);
  };

  const handleEdit = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    setSelectedRole(role || null);
    setEditDialogOpen(true);
  };

  const handleDelete = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    setSelectedRole(role || null);
    setDeleteDialogOpen(true);
  };

  const handleNavigateToPermissions = (roleId: string) => {
    navigate(`/admin/roles/${roleId}/permissions`);
  };

  // Dialog confirm handlers
  const confirmAddRole = async (data: CreateRoleRequest) => {
    try {
      // Transform role name to uppercase to match backend validation
      const roleData = {
        ...data,
        name: data.name.toUpperCase().trim(),
        description: data.description?.trim() || "", // Ensure description is included
      };

      await createRole(roleData).unwrap();
      toast.success("Role created successfully!");
      setAddDialogOpen(false);
    } catch (error: any) {
      console.error("Failed to create role:", error);
      toast.error(error?.data?.message || "Failed to create role");
    }
  };

  // TODO: Implement when backend endpoints are ready
  const confirmEditRole = async (_data: UpdateRoleRequest) => {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    // eslint-disable-line @typescript-eslint/no-unused-vars
    if (selectedRole) {
      try {
        // Transform role name to uppercase when backend is implemented
        // const roleData = {
        //   ...data,
        //   name: data.name?.toUpperCase().trim(),
        // };
        // await updateRole({ id: selectedRole.id, data: roleData }).unwrap();
        toast.info("Update role feature is not implemented yet!");
        setEditDialogOpen(false);
        setSelectedRole(null);
        // refetch();
      } catch (error: any) {
        console.error("Failed to update role:", error);
        toast.error(error?.data?.message || "Failed to update role");
      }
    }
  };

  const confirmDeleteRole = async () => {
    if (selectedRole) {
      try {
        // await deleteRole(selectedRole.id).unwrap();
        toast.info("Delete role feature is not implemented yet!");
        setDeleteDialogOpen(false);
        setSelectedRole(null);
        // refetch();
      } catch (error: any) {
        console.error("Failed to delete role:", error);
        toast.error(error?.data?.message || "Failed to delete role");
      }
    }
  };

  const confirmAssignPermissions = async (permissionIds: string[]) => {
    if (selectedRole) {
      try {
        await assignPermissions({
          id: selectedRole.id,
          data: { permissionIds },
        }).unwrap();
        toast.success("Permissions assigned successfully!");
        setAssignPermissionsDialogOpen(false);
        setSelectedRole(null);
        refetch();
      } catch (error: any) {
        console.error("Failed to assign permissions:", error);
        toast.error(error?.data?.message || "Failed to assign permissions");
      }
    }
  };

  // Pagination
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // First page
      items.push(
        <PaginationItem key={0}>
          <PaginationLink
            onClick={() => handlePageChange(0)}
            isActive={currentPage === 0}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 2) {
        items.push(<PaginationEllipsis key="start-ellipsis" />);
      }

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 3) {
        items.push(<PaginationEllipsis key="end-ellipsis" />);
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages - 1}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages - 1)}
              isActive={currentPage === totalPages - 1}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <h3 className="text-lg font-semibold mb-2">
                Error Loading Roles
              </h3>
              <p className="text-sm mb-4">
                {(error as any)?.data?.message || "Failed to load roles"}
              </p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground">
            Manage system roles and their permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalElements}</div>
            <p className="text-xs text-muted-foreground">
              {activeRolesCount} active roles
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRolesCount}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Permissions
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPermissionsCount}</div>
            <p className="text-xs text-muted-foreground">
              Available permissions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Permissions/Role
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roles.length > 0
                ? Math.round(
                    roles.reduce((sum, role) => sum + role.permissionCount, 0) /
                      roles.length
                  )
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Average per role</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Roles List</CardTitle>
            <div className="flex gap-2">
              <SearchBar
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search roles..."
              />
              <RoleFilterBar
                statusFilter={filters.status}
                onStatusChange={handleStatusChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <RoleTable
            roles={roles}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNavigateToPermissions={handleNavigateToPermissions}
            isLoading={isLoading}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(0, currentPage - 1))
                      }
                      className={
                        currentPage === 0
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {generatePaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(
                          Math.min(totalPages - 1, currentPage + 1)
                        )
                      }
                      className={
                        currentPage === totalPages - 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddRoleDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onConfirm={confirmAddRole}
        isLoading={isCreating}
      />

      <EditRoleDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        role={selectedRole}
        onConfirm={confirmEditRole}
        isLoading={false} // isUpdating not available yet
      />

      <ViewRoleDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        role={selectedRole}
        permissions={[]}
      />

      <DeleteRoleDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        role={selectedRole}
        onConfirm={confirmDeleteRole}
        isLoading={false} // isDeleting not available yet
      />

      <AssignPermissionsDialog
        open={assignPermissionsDialogOpen}
        onOpenChange={setAssignPermissionsDialogOpen}
        role={selectedRole}
        allPermissions={allPermissions}
        currentPermissions={[]}
        onConfirm={confirmAssignPermissions}
        isLoading={isAssigning}
      />
    </div>
  );
};
