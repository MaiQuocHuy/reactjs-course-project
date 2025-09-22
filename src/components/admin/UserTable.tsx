import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal, Shield, UserMinus, UserPlus, Edit } from "lucide-react";
import type { User } from "../../types/users";
import { usePermission } from "../../hooks/usePermissions";

interface UserTableProps {
  users: User[];
  onBanUser: (userId: string) => void;
  onUnbanUser: (userId: string) => void;
  onEditUser: (userId: string) => void;
  onAssignRole: (userId: string) => void;
  onViewUser: (userId: string) => void;
  currentPage?: number;
  pageSize?: number;
}

const getRoleBadgeVariant = (role: User["role"]) => {
  switch (role) {
    case "ADMIN":
      return "destructive";
    case "INSTRUCTOR":
      return "default";
    case "STUDENT":
      return "secondary";
    default:
      return "outline";
  }
};

const getStatusBadgeVariant = (status: User["status"]) => {
  switch (status) {
    case "ACTIVE":
      return "active";
    case "BANNED":
      return "destructive";
    case "INACTIVE":
      return "secondary";
    default:
      return "outline";
  }
};

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onBanUser,
  onUnbanUser,
  onEditUser,
  onAssignRole,
  onViewUser,
  currentPage = 0,
  pageSize = 10,
}) => {
  const { hasPermission: canUpdateUser } = usePermission("user:UPDATE");

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">#</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell className="text-center font-medium">
                {currentPage * pageSize + index + 1}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3" onClick={() => onViewUser(user.id)}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewUser(user.id)}>
                      View Details
                    </DropdownMenuItem>
                    {canUpdateUser && (
                      <DropdownMenuItem onClick={() => onEditUser(user.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                    )}
                    {canUpdateUser && (
                      <DropdownMenuItem onClick={() => onAssignRole(user.id)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Assign Role
                      </DropdownMenuItem>
                    )}
                    {canUpdateUser && user.status === "ACTIVE" ? (
                      <DropdownMenuItem onClick={() => onBanUser(user.id)} className="text-red-600">
                        <UserMinus className="mr-2 h-4 w-4" />
                        Ban User
                      </DropdownMenuItem>
                    ) : canUpdateUser && user.status === "BANNED" ? (
                      <DropdownMenuItem
                        onClick={() => onUnbanUser(user.id)}
                        className="text-green-600"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Unban User
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
