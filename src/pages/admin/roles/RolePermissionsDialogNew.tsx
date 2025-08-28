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

interface Permission {
  permissionKey: string;
  description: string;
  resource: string;
  action: string;
  filterType: string | null;
  isAssigned: boolean;
  canAssignToRole: boolean;
  isRestricted: boolean;
  allowedRoles: string[];
}

interface PermissionResponse {
  resources: Record<string, Permission[]>;
}

interface RolePermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleId: string | null;
  roleName: string;
}

// Custom hook to fetch permissions
const useGetRolePermissions = (roleId: string | null, enabled: boolean) => {
  const [data, setData] = React.useState<{ data: PermissionResponse } | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<any>(null);

  React.useEffect(() => {
    if (!roleId || !enabled) return;

    const fetchPermissions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/permissions/${roleId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch permissions");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [roleId, enabled]);

  return { data, isLoading, error };
};

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
  } = useGetRolePermissions(roleId, open);

  const resources = permissionsResponse?.data?.resources || {};

  const getActionColor = (action: string, isAssigned: boolean) => {
    if (!isAssigned) {
      return "bg-gray-100 text-gray-500 hover:bg-gray-200";
    }

    switch (action.toLowerCase()) {
      case "read":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "create":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "update":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "delete":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "approve":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getResourceIcon = (resource: string) => {
    switch (resource.toLowerCase()) {
      case "user":
        return <User className="h-4 w-4" />;
      case "role":
        return <Shield className="h-4 w-4" />;
      default:
        return <ShieldCheck className="h-4 w-4" />;
    }
  };

  const totalPermissions = Object.values(resources).reduce(
    (total, permissions) => total + permissions.length,
    0
  );
  const assignedPermissions = Object.values(resources).reduce(
    (total, permissions) =>
      total + permissions.filter((p) => p.isAssigned).length,
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Permissions for Role: {roleName}
          </DialogTitle>
          <DialogDescription>
            View all permissions assigned to this role ({assignedPermissions} of{" "}
            {totalPermissions} permissions assigned)
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <Alert>
              <AlertDescription>
                Error loading permissions. Please try again.
              </AlertDescription>
            </Alert>
          ) : totalPermissions === 0 ? (
            <Alert>
              <AlertDescription>
                This role has no permissions available.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              {Object.entries(resources).map(([resource, permissions]) => (
                <div key={resource} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getResourceIcon(resource)}
                    <h3 className="font-semibold text-lg capitalize">
                      {resource.replace("_", " ")}
                    </h3>
                    <Badge variant="outline" className="ml-auto">
                      {permissions.filter((p) => p.isAssigned).length} /{" "}
                      {permissions.length} assigned
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {permissions.map((permission) => (
                      <div
                        key={permission.permissionKey}
                        className={`p-4 border rounded-lg space-y-2 ${
                          permission.isAssigned
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Badge
                            className={`text-xs font-medium ${getActionColor(
                              permission.action,
                              permission.isAssigned
                            )}`}
                            variant="secondary"
                          >
                            {permission.action}
                          </Badge>
                          {permission.isAssigned ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">
                            {permission.permissionKey}
                          </p>
                          <p className="text-xs text-gray-600">
                            {permission.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {permission.filterType && (
                            <Badge variant="outline" className="text-xs">
                              {permission.filterType}
                            </Badge>
                          )}
                          {permission.isRestricted && (
                            <Badge variant="destructive" className="text-xs">
                              Restricted
                            </Badge>
                          )}
                          {!permission.canAssignToRole && (
                            <Badge variant="secondary" className="text-xs">
                              Fixed
                            </Badge>
                          )}
                        </div>

                        {permission.allowedRoles.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500">
                              Allowed roles:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {permission.allowedRoles.map((role) => (
                                <Badge
                                  key={role}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <Separator />
                </div>
              ))}

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-lg text-blue-600">
                      {totalPermissions}
                    </div>
                    <div className="text-muted-foreground">
                      Total Permissions
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg text-green-600">
                      {assignedPermissions}
                    </div>
                    <div className="text-muted-foreground">Assigned</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg text-gray-600">
                      {totalPermissions - assignedPermissions}
                    </div>
                    <div className="text-muted-foreground">Not Assigned</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg text-purple-600">
                      {Object.keys(resources).length}
                    </div>
                    <div className="text-muted-foreground">Resources</div>
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
