import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useGetRoleByIdQuery } from "@/services/rolesApi";

interface ViewRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleId: string | null;
}

export const ViewRoleDialog: React.FC<ViewRoleDialogProps> = ({
  open,
  onOpenChange,
  roleId,
}) => {
  const {
    data: roleResponse,
    isLoading,
    error,
  } = useGetRoleByIdQuery(roleId!, {
    skip: !roleId || !open,
  });

  const role = roleResponse?.data;

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Error Loading Role
            </DialogTitle>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load role details. Please try again.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[70vw] max-w-[70vw] sm:max-w-[70vw] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Skeleton className="h-6 w-20" />
              Role Details
            </DialogTitle>
            <DialogDescription>
              View role information and assigned permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!role) {
    return null;
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[70vw] max-w-[70vw] sm:max-w-[70vw] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge variant="outline" className="text-lg px-3 py-1">
              {role.name}
            </Badge>
            Role Details
          </DialogTitle>
          <DialogDescription>
            View role information and assigned permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {/* Role Basic Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    📋 Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Role Name
                        </label>
                        <p className="text-lg font-semibold mt-1">
                          {role.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Total Permissions
                        </label>
                        <div className="mt-1">
                          <Badge
                            variant="secondary"
                            className="text-base px-3 py-1"
                          >
                            {role.permissions?.length || 0}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Role ID
                        </label>
                        <p className="text-sm font-mono mt-1 p-2 bg-gray-100 rounded">
                          {role.id}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Users Count
                        </label>
                        <div className="mt-1">
                          <Badge
                            variant="outline"
                            className="text-base px-3 py-1"
                          >
                            {role.totalUsers || 0}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Permissions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    🔐 Permissions
                  </CardTitle>
                  <CardDescription>
                    Permissions assigned to this role (
                    {role.permissions?.length || 0} total)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {role.permissions && role.permissions.length > 0 ? (
                    <div className="space-y-3">
                      {role.permissions.map((rolePermission, index) => {
                        // Cast to any to access potential different data structures
                        const perm = rolePermission as any;

                        // Try different ways to get permission name
                        const permissionName =
                          perm.permission?.name ||
                          perm.name ||
                          (typeof perm === "string" ? perm : null) ||
                          `Permission ${index + 1}`;

                        const permissionDescription =
                          perm.permission?.description ||
                          perm.description ||
                          null;

                        return (
                          <div
                            key={perm.id || index}
                            className="flex items-start gap-3 p-3 border rounded-lg"
                          >
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 mb-1">
                                {permissionName}
                              </h4>
                              {permissionDescription && (
                                <p className="text-sm text-gray-600">
                                  {permissionDescription}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">🔒</div>
                      <p className="text-muted-foreground">
                        No permissions assigned to this role
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
