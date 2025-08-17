import React, { useState, useMemo } from "react";
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
import { mockUsers } from "../../../data/mockData";
import type {
  User,
  UserRole,
  UserStatus,
  UserFilters,
} from "../../../types/users";

const ITEMS_PER_PAGE = 10;

export const UsersListPage: React.FC = () => {
  const navigate = useNavigate();

  // State for users data
  const [users, setUsers] = useState<User[]>(mockUsers);

  // State for filters and pagination
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "ALL",
    status: "ALL",
  });
  const [currentPage, setCurrentPage] = useState(1);

  // State for dialogs
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [unbanDialogOpen, setUnbanDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignRoleDialogOpen, setAssignRoleDialogOpen] = useState(false);

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRole = filters.role === "ALL" || user.role === filters.role;
      const matchesStatus =
        filters.status === "ALL" || user.status === filters.status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Handle filter changes
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
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user || null);
    setBanDialogOpen(true);
  };

  const handleUnbanUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user || null);
    setUnbanDialogOpen(true);
  };

  const handleEditUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user || null);
    setEditDialogOpen(true);
  };

  const handleAssignRole = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user || null);
    setAssignRoleDialogOpen(true);
  };

  // Dialog confirm handlers
  const confirmBanUser = () => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? { ...user, status: "BANNED" as UserStatus }
            : user
        )
      );
    }
    setBanDialogOpen(false);
    setSelectedUser(null);
  };

  const confirmUnbanUser = () => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? { ...user, status: "ACTIVE" as UserStatus }
            : user
        )
      );
    }
    setUnbanDialogOpen(false);
    setSelectedUser(null);
  };

  const confirmEditUser = (userData: Partial<User>) => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? { ...user, ...userData, updatedAt: new Date().toISOString() }
            : user
        )
      );
    }
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const confirmAssignRole = (role: UserRole) => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? { ...user, role, updatedAt: new Date().toISOString() }
            : user
        )
      );
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
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.status === "ACTIVE").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instructors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === "INSTRUCTOR").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banned Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.status === "BANNED").length}
            </div>
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
              Showing {startIndex + 1}-
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </p>
          </div>

          <UserTable
            users={paginatedUsers}
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
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
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
                        currentPage === totalPages
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
