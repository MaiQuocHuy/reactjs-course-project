import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, ShieldCheck, User, CheckCircle, XCircle } from "lucide-react";
import {
  useGetRolePermissionsQuery,
  type Permission,
  type PermissionsByResource,
} from "@/services/rolesApi";

interface RolePermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleId: string | null;
  roleName: string;
}

export const RolePermissionsDialog: React.FC<RolePermissionsDialogProps> = ({
  open,
  onOpenChange,
  roleId,
  roleName,
}) => {
  const {
    data: permissionsResponse,
    isLoading,
    error,
  } = useGetRolePermissionsQuery(roleId!, {
    skip: !roleId || !open,
  });

  console.log("Permissions Response:", permissionsResponse);
  console.log("Resources data:", permissionsResponse?.data?.resources);

  const resources: PermissionsByResource =
    permissionsResponse?.data?.resources || {};

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "read":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "create":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "update":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "delete":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatPermissionName = (name: string) => {
    return name.replace(/([A-Z])/g, " $1").trim();
  };

  // Count only assigned permissions
  const totalPermissions = Object.values(resources).reduce(
    (total, permissions) =>
      total +
      (permissions?.filter((p: any) => p?.isAssigned === true)?.length || 0),
    0
  );

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[70vw] max-w-[70vw] sm:max-w-[70vw] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permissions for {roleName}
            </DialogTitle>
          </DialogHeader>
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load permissions. Please try again.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[70vw] max-w-[70vw] sm:max-w-[70vw] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permissions for {roleName}
          </DialogTitle>
          <DialogDescription>
            View all permissions assigned to this role ({totalPermissions}{" "}
            permissions total)
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="h-8 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : totalPermissions === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No permissions assigned to this role
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(resources)
                .filter(([_, permissions]) =>
                  permissions?.some((p: any) => p?.isAssigned === true)
                )
                .map(([resourceName, permissions]) => {
                  const assignedPermissions =
                    permissions?.filter((p: any) => p?.isAssigned === true) ||
                    [];

                  return (
                    <div key={resourceName} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold capitalize">
                          {resourceName}
                        </h3>
                        <Badge variant="secondary" className="ml-auto">
                          {assignedPermissions.length} assigned
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {permissions
                          ?.filter(
                            (permission: any) => permission?.isAssigned === true
                          )
                          ?.map((permission: any, index: number) => {
                            console.log(
                              "Assigned Permission object:",
                              permission
                            );

                            // Handle different permission object structures
                            const permissionName =
                              permission?.name ||
                              permission?.permissionKey ||
                              permission?.action ||
                              `Unknown Permission ${index}`;
                            const action = permissionName.includes(":")
                              ? permissionName.split(":")[1]
                              : permissionName;

                            return (
                              <Badge
                                key={
                                  permission?.id ||
                                  permission?.permissionKey ||
                                  index
                                }
                                variant="outline"
                                className={`${getActionColor(
                                  action
                                )} justify-center text-center cursor-default transition-colors`}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {formatPermissionName(action)}
                              </Badge>
                            );
                          })}
                      </div>
                      <Separator />
                    </div>
                  );
                })}

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Permission Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Total Permissions:</span>
                    <Badge variant="outline">{totalPermissions}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Resource Types:</span>
                    <Badge variant="outline">
                      {Object.keys(resources).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Role:</span>
                    <Badge variant="default">{roleName}</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RolePermissionsDialog;
