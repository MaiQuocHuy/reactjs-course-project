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
import { UserTable } from "../../../components/admin/UserTable";
import { SearchBar } from "../../../components/admin/SearchBar";
import { FilterBar } from "../../../components/admin/FilterBar";
import {
  BanUserDialog,
  UnbanUserDialog,
  EditUserDialog,
  AssignRoleDialog,
} from "../../../components/admin/UserDialogs";
import { Users, UserPlus, Download } from "lucide-react";
import {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
} from "../../../services/usersApi";
import type {
  User,
  UserRole,
  UserStatus,
  UserFilters,
} from "../../../types/users";

const ITEMS_PER_PAGE = 10;

export const UsersListPage: React.FC = () => {
  const navigate = useNavigate();

  // State for filters and pagination
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "ALL",
    status: "ALL",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(ITEMS_PER_PAGE);

  // API hooks
  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useGetUsersQuery({
    search: filters.search || undefined,
    role: filters.role !== "ALL" ? filters.role : undefined,
    isActive:
      filters.status === "ACTIVE"
        ? true
        : filters.status === "BANNED"
        ? false
        : undefined,
    page: currentPage - 1, // Backend uses 0-based pagination
    size: pageSize,
    sort: "name,asc",
  });

  // API hooks for statistics - get first page with size 1 to get total counts
  const { data: activeUsersResponse } = useGetUsersQuery({
    isActive: true,
    page: 0,
    size: 1,
  });

  const { data: instructorsResponse } = useGetUsersQuery({
    role: "INSTRUCTOR",
    page: 0,
    size: 1,
  });

  const { data: bannedUsersResponse } = useGetUsersQuery({
    isActive: false,
    page: 0,
    size: 1,
  });

  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();

  // State for dialogs
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [unbanDialogOpen, setUnbanDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignRoleDialogOpen, setAssignRoleDialogOpen] = useState(false);

  // Extract data from API response
  const users = usersResponse?.data?.users || [];
  const totalPages = usersResponse?.data?.totalPages || 0;
  const totalElements = usersResponse?.data?.totalElements || 0;
  const hasNext = usersResponse?.data?.hasNext || false;
  const hasPrevious = usersResponse?.data?.hasPrevious || false;

  // Extract statistics from separate API calls
  const activeUsersCount = activeUsersResponse?.data?.totalElements || 0;
  const instructorsCount = instructorsResponse?.data?.totalElements || 0;
  const bannedUsersCount = bannedUsersResponse?.data?.totalElements || 0;

  // Map API user data to component format (convert isActive to status)
  const mappedUsers: User[] = users.map((user) => ({
    ...user,
    status: user.isActive ? ("ACTIVE" as UserStatus) : ("BANNED" as UserStatus),
    avatar: user.thumbnailUrl || user.avatar,
  }));

  // Handle filter changes (trigger new API call)
  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setCurrentPage(1);
  };

  const handleRoleChange = (role: UserRole | "ALL") => {
    setFilters((prev) => ({ ...prev, role }));
    setCurrentPage(1);
  };

  const handleStatusChange = (status: UserStatus | "ALL") => {
    setFilters((prev) => ({ ...prev, status }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ search: "", role: "ALL", status: "ALL" });
    setCurrentPage(1);
  };

  // Handle user actions
  const handleViewUser = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleBanUser = (userId: string) => {
    const user = mappedUsers.find((u) => u.id === userId);
    setSelectedUser(user || null);
    setBanDialogOpen(true);
  };

  const handleUnbanUser = (userId: string) => {
    const user = mappedUsers.find((u) => u.id === userId);
    setSelectedUser(user || null);
    setUnbanDialogOpen(true);
  };

  const handleEditUser = (userId: string) => {
    const user = mappedUsers.find((u) => u.id === userId);
    setSelectedUser(user || null);
    setEditDialogOpen(true);
  };

  const handleAssignRole = (userId: string) => {
    const user = mappedUsers.find((u) => u.id === userId);
    setSelectedUser(user || null);
    setAssignRoleDialogOpen(true);
  };

  // Dialog confirm handlers - Using API mutations
  const confirmBanUser = async () => {
    if (selectedUser) {
      try {
        await updateUserStatus({
          id: selectedUser.id,
          data: { isActive: false },
        }).unwrap();
        refetch(); // Refresh the data after successful update
      } catch (error) {
        console.error("Failed to ban user:", error);
      }
    }
    setBanDialogOpen(false);
    setSelectedUser(null);
  };

  const confirmUnbanUser = async () => {
    if (selectedUser) {
      try {
        await updateUserStatus({
          id: selectedUser.id,
          data: { isActive: true },
        }).unwrap();
        refetch(); // Refresh the data after successful update
      } catch (error) {
        console.error("Failed to unban user:", error);
      }
    }
    setUnbanDialogOpen(false);
    setSelectedUser(null);
  };

  const confirmEditUser = (_userData: Partial<User>) => {
    // This would need a separate API call for updating user profile
    // For now, just close the dialog
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const confirmAssignRole = async (role: UserRole) => {
    if (selectedUser) {
      try {
        await updateUserRole({
          id: selectedUser.id,
          data: { role },
        }).unwrap();
        refetch(); // Refresh the data after successful update
      } catch (error) {
        console.error("Failed to assign role:", error);
      }
    }
    setAssignRoleDialogOpen(false);
    setSelectedUser(null);
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Add first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Add ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Add pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Add ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Add last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => setCurrentPage(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading users</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions for Sybau Education
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalElements}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsersCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instructors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{instructorsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banned Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bannedUsersCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
            <SearchBar
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search by name or email..."
            />
            <FilterBar
              roleFilter={filters.role}
              statusFilter={filters.status}
              onRoleChange={handleRoleChange}
              onStatusChange={handleStatusChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, totalElements)} of{" "}
              {totalElements} users
            </p>
          </div>

          <UserTable
            users={mappedUsers}
            onBanUser={handleBanUser}
            onUnbanUser={handleUnbanUser}
            onEditUser={handleEditUser}
            onAssignRole={handleAssignRole}
            onViewUser={handleViewUser}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      className={
                        !hasPrevious ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        !hasNext ? "pointer-events-none opacity-50" : ""
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
      <BanUserDialog
        open={banDialogOpen}
        onOpenChange={setBanDialogOpen}
        user={selectedUser}
        onConfirm={confirmBanUser}
      />

      <UnbanUserDialog
        open={unbanDialogOpen}
        onOpenChange={setUnbanDialogOpen}
        user={selectedUser}
        onConfirm={confirmUnbanUser}
      />

      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={selectedUser}
        onConfirm={confirmEditUser}
      />

      <AssignRoleDialog
        open={assignRoleDialogOpen}
        onOpenChange={setAssignRoleDialogOpen}
        user={selectedUser}
        onConfirm={confirmAssignRole}
      />
    </div>
  );
};
