import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  ShieldCheck,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  useGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation,
  type UpdateRolePermissionsRequest,
} from "@/services/rolesApi";
import { toast } from "sonner";

interface AssignPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleId: string | null;
  roleName: string;
  onSuccess?: () => void;
}

export const AssignPermissionsDialog: React.FC<
  AssignPermissionsDialogProps
> = ({ open, onOpenChange, roleId, roleName, onSuccess }) => {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );
  const [expandedResources, setExpandedResources] = useState<Set<string>>(
    new Set()
  );

  const {
    data: permissionsResponse,
    isLoading,
    error,
    refetch,
  } = useGetRolePermissionsQuery(roleId!, {
    skip: !roleId || !open,
  });

  const [updateRolePermissions, { isLoading: isUpdating }] =
    useUpdateRolePermissionsMutation();

  const resources = permissionsResponse?.data?.resources || {};

  // Initialize selected permissions and expand all resources
  useEffect(() => {
    if (permissionsResponse?.data?.resources) {
      const assigned = new Set<string>();
      const resourceNames = new Set<string>();

      Object.entries(resources).forEach(([resourceName, permissions]) => {
        resourceNames.add(resourceName);
        permissions?.forEach((permission: any) => {
          if (permission?.isAssigned) {
            assigned.add(permission.permissionKey);
          }
        });
      });

      setSelectedPermissions(assigned);
      setExpandedResources(resourceNames); // Expand all by default
    }
  }, [permissionsResponse]);

  const handlePermissionToggle = (permissionKey: string) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionKey)) {
      newSelected.delete(permissionKey);
    } else {
      newSelected.add(permissionKey);
    }
    setSelectedPermissions(newSelected);
  };

  const toggleResourceExpansion = (resourceName: string) => {
    const newExpanded = new Set(expandedResources);
    if (newExpanded.has(resourceName)) {
      newExpanded.delete(resourceName);
    } else {
      newExpanded.add(resourceName);
    }
    setExpandedResources(newExpanded);
  };

  const toggleAllResourcePermissions = (resourceName: string) => {
    const resourcePermissions =
      resources[resourceName]?.filter((p: any) => p?.canAssignToRole) || [];

    const resourcePermissionKeys = resourcePermissions.map(
      (p: any) => p.permissionKey
    );

    // Check if all permissions in this resource are selected
    const allSelected = resourcePermissionKeys.every((key: string) =>
      selectedPermissions.has(key)
    );

    const newSelected = new Set(selectedPermissions);

    if (allSelected) {
      // Deselect all permissions in this resource
      resourcePermissionKeys.forEach((key: string) => {
        newSelected.delete(key);
      });
    } else {
      // Select all permissions in this resource
      resourcePermissionKeys.forEach((key: string) => {
        newSelected.add(key);
      });
    }

    setSelectedPermissions(newSelected);
  };

  const handleSave = async () => {
    if (!roleId) return;

    // Validation: Role must have at least 1 permission
    if (selectedPermissions.size === 0) {
      toast.error(
        "Role must have at least 1 permission. Please select at least one permission before saving."
      );
      return;
    }

    try {
      const permissionsToUpdate: UpdateRolePermissionsRequest = {
        permissions: Array.from(selectedPermissions).map((key) => ({
          key,
          filterType: "filter-type-001",
        })),
      };

      console.log("🔄 Updating permissions for role:", roleId);
      console.log("📝 Permissions to update:", permissionsToUpdate);

      const result = await updateRolePermissions({
        roleId,
        data: permissionsToUpdate,
      }).unwrap();

      console.log("✅ Update successful:", result);

      toast.success(`Permissions updated successfully for ${roleName}`);
      onOpenChange(false);
      refetch();

      // Wait a bit for cache invalidation to process, then force refresh
      setTimeout(() => {
        console.log("🔄 Calling onSuccess callback to refresh parent");
        onSuccess?.();
      }, 100);
    } catch (error) {
      console.error("❌ Error updating permissions:", error);
      toast.error("Failed to update permissions. Please try again.");
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "read":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "create":
        return "text-green-600 bg-green-50 border-green-200";
      case "update":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "delete":
        return "text-red-600 bg-red-50 border-red-200";
      case "approve":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "publish":
        return "text-indigo-600 bg-indigo-50 border-indigo-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Error Loading Permissions
            </DialogTitle>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load permissions. Please try again.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[85vw] max-w-[85vw] sm:max-w-[85vw] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Assign permissions for <Badge variant="outline">
              {roleName}
            </Badge>{" "}
            role
          </DialogTitle>
          <DialogDescription>
            Select permissions to assign to this role.{" "}
            {selectedPermissions.size} permissions selected.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-[500px] pr-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <div className="ml-4 space-y-2">
                      {[...Array(3)].map((_, j) => (
                        <Skeleton key={j} className="h-6 w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : Object.keys(resources).length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No permissions available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(resources).map(
                  ([resourceName, permissions]) => {
                    const availablePermissions =
                      permissions?.filter((p: any) => p?.canAssignToRole) || [];

                    if (availablePermissions.length === 0) return null;

                    const isExpanded = expandedResources.has(resourceName);
                    const selectedCount = availablePermissions.filter(
                      (p: any) => selectedPermissions.has(p.permissionKey)
                    ).length;

                    return (
                      <div key={resourceName} className="border rounded-lg">
                        {/* Resource Header */}
                        <div className="flex items-center justify-between p-4">
                          <div
                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 flex-1 py-2 px-2 rounded"
                            onClick={() =>
                              toggleResourceExpansion(resourceName)
                            }
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-500" />
                            )}
                            <ShieldCheck className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-medium capitalize">
                              {resourceName.replace(/_/g, " ")}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAllResourcePermissions(resourceName);
                              }}
                              className="text-xs h-7"
                            >
                              {availablePermissions.every((p: any) =>
                                selectedPermissions.has(p.permissionKey)
                              ) ? (
                                <>
                                  <X className="h-3 w-3 mr-1" />
                                  Deselect All
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Select All
                                </>
                              )}
                            </Button>
                            <Badge
                              variant={
                                selectedCount > 0 ? "default" : "secondary"
                              }
                            >
                              {selectedCount}/{availablePermissions.length}
                            </Badge>
                          </div>
                        </div>

                        {/* Permissions List */}
                        {isExpanded && (
                          <div className="border-t bg-gray-50/50 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {availablePermissions.map(
                                (permission: any, index: number) => {
                                  const action =
                                    permission?.action ||
                                    permission?.permissionKey?.split(":")[1] ||
                                    "unknown";
                                  const isSelected = selectedPermissions.has(
                                    permission.permissionKey
                                  );

                                  return (
                                    <div
                                      key={permission?.permissionKey || index}
                                      className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                        isSelected
                                          ? "border-blue-300 bg-blue-50"
                                          : "border-gray-200 bg-white hover:border-gray-300"
                                      }`}
                                      onClick={() =>
                                        handlePermissionToggle(
                                          permission.permissionKey
                                        )
                                      }
                                    >
                                      <Checkbox
                                        checked={isSelected}
                                        className="mt-0.5"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <Badge
                                            variant="outline"
                                            className={`text-xs ${getActionColor(
                                              action
                                            )}`}
                                          >
                                            {action.toUpperCase()}
                                          </Badge>
                                          {isSelected && (
                                            <CheckCircle className="h-4 w-4 text-blue-600" />
                                          )}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                          {permission.description}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="flex items-center justify-between pt-4">
          <div className="text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600">
                <span
                  className={
                    selectedPermissions.size === 0
                      ? "text-red-600"
                      : "text-gray-900"
                  }
                >
                  {selectedPermissions.size}
                </span>{" "}
                permissions selected
              </span>
              {selectedPermissions.size === 0 && (
                <Badge variant="destructive" className="text-xs">
                  At least 1 required
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating || selectedPermissions.size === 0}
              className={
                selectedPermissions.size === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            >
              {isUpdating ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Permissions
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignPermissionsDialog;
