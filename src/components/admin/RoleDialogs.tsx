import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import type { Role, Permission } from "../../types/roles/index";
import type {
  CreateRoleRequest,
  UpdateRoleRequest,
} from "../../services/rolesApi";
import { Shield, Search } from "lucide-react";

// Add Role Dialog
interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: CreateRoleRequest) => void;
  isLoading?: boolean;
}

export const AddRoleDialog: React.FC<AddRoleDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateRoleRequest>({
    name: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onConfirm(formData);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", description: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Role</DialogTitle>
          <DialogDescription>
            Create a new role with basic information. You can assign permissions
            later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter role name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter role description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name.trim()}>
              {isLoading ? "Creating..." : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Edit Role Dialog
interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onConfirm: (data: UpdateRoleRequest) => void;
  isLoading?: boolean;
}

export const EditRoleDialog: React.FC<EditRoleDialogProps> = ({
  open,
  onOpenChange,
  role,
  onConfirm,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<UpdateRoleRequest>({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description || "",
      });
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name?.trim()) {
      onConfirm(formData);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", description: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>Update the role information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter role name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter role description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name?.trim()}
            >
              {isLoading ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// View Role Dialog
interface ViewRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  permissions: Permission[];
}

export const ViewRoleDialog: React.FC<ViewRoleDialogProps> = ({
  open,
  onOpenChange,
  role,
  permissions,
}) => {
  if (!role) return null;

  const groupedPermissions = permissions.reduce((acc, permission) => {
    const resourceName = permission.resource.name;
    if (!acc[resourceName]) {
      acc[resourceName] = [];
    }
    acc[resourceName].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {role.name}
          </DialogTitle>
          <DialogDescription>
            Role details and assigned permissions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Role Info */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-gray-600 mt-1">
                {role.description || "No description provided"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  <Badge
                    variant={role.status === "ACTIVE" ? "default" : "secondary"}
                    className={
                      role.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {role.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Permissions</Label>
                <div className="mt-1">
                  <Badge variant="secondary">{role.permissionCount}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <Label className="text-sm font-medium">Assigned Permissions</Label>
            {permissions.length > 0 ? (
              <ScrollArea className="h-[300px] mt-2 border rounded-md p-4">
                <div className="space-y-4">
                  {Object.entries(groupedPermissions).map(
                    ([resource, perms]) => (
                      <div key={resource}>
                        <h4 className="font-medium text-sm capitalize mb-2">
                          {resource}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {perms.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center space-x-2 p-2 bg-gray-50 rounded"
                            >
                              <Badge variant="outline" className="text-xs">
                                {permission.action.name}
                              </Badge>
                              <span className="text-xs text-gray-600">
                                {permission.permissionKey}
                              </span>
                            </div>
                          ))}
                        </div>
                        <Separator className="mt-2" />
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                No permissions assigned
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Delete Role Dialog
interface DeleteRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteRoleDialog: React.FC<DeleteRoleDialogProps> = ({
  open,
  onOpenChange,
  role,
  onConfirm,
  isLoading = false,
}) => {
  if (!role) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Role</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the role "{role.name}"? This action
            cannot be undone and will remove all permission assignments for this
            role.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Assign Permissions Dialog
interface AssignPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  allPermissions: Permission[];
  currentPermissions: Permission[];
  onConfirm: (permissionIds: string[]) => void;
  isLoading?: boolean;
}

export const AssignPermissionsDialog: React.FC<
  AssignPermissionsDialogProps
> = ({
  open,
  onOpenChange,
  role,
  allPermissions,
  currentPermissions,
  onConfirm,
  isLoading = false,
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open && currentPermissions) {
      setSelectedPermissions(currentPermissions.map((p) => p.id));
    }
  }, [open, currentPermissions]);

  const filteredPermissions = allPermissions.filter(
    (permission) =>
      (permission.permissionKey || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (permission.resource?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (permission.action?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    const resourceName = permission.resource.name;
    if (!acc[resourceName]) {
      acc[resourceName] = [];
    }
    acc[resourceName].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = () => {
    onConfirm(selectedPermissions);
  };

  const handleClose = () => {
    setSearchTerm("");
    onOpenChange(false);
  };

  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Assign Permissions to {role.name}</DialogTitle>
          <DialogDescription>
            Select permissions to assign to this role
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Permissions List */}
          <ScrollArea className="h-[400px] border rounded-md p-4">
            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(
                ([resource, permissions]) => (
                  <div key={resource}>
                    <h4 className="font-medium capitalize mb-3">{resource}</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <Checkbox
                            id={permission.id}
                            checked={selectedPermissions.includes(
                              permission.id
                            )}
                            onCheckedChange={() =>
                              handlePermissionToggle(permission.id)
                            }
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                {permission.permissionKey}
                              </code>
                              <Badge variant="outline" className="text-xs">
                                {permission.action.name}
                              </Badge>
                            </div>
                            {permission.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {permission.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator className="mt-4" />
                  </div>
                )
              )}
            </div>
          </ScrollArea>

          {/* Selected Count */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {selectedPermissions.length} permissions selected
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Assigning..." : "Assign Permissions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
