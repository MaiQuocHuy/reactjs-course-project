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
import type { RoleWithPermissions } from "@/services/rolesApi";

interface ViewRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleWithPermissions;
}

export const ViewRoleDialog: React.FC<ViewRoleDialogProps> = ({
  open,
  onOpenChange,
  role,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Role Details</DialogTitle>
          <DialogDescription>
            View role information and assigned permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Role Basic Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Role Name
                  </label>
                  <p className="text-sm font-semibold">{role.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Role ID
                  </label>
                  <p className="text-sm font-mono">{role.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Total Permissions
                  </label>
                  <p className="text-sm">
                    <Badge variant="secondary">
                      {role.permissions?.length || 0}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Users Count
                  </label>
                  <p className="text-sm">
                    <Badge variant="outline">{role.totalUsers || 0}</Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Permissions</CardTitle>
              <CardDescription>
                Permissions assigned to this role
              </CardDescription>
            </CardHeader>
            <CardContent>
              {role.permissions && role.permissions.length > 0 ? (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {role.permissions.map((rolePermission) => (
                      <div
                        key={rolePermission.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">
                            {rolePermission.permission.name}
                          </h4>
                          {rolePermission.permission.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {rolePermission.permission.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {rolePermission.filterType && (
                            <Badge variant="outline" className="text-xs">
                              {rolePermission.filterType}
                            </Badge>
                          )}
                          <Badge
                            variant={
                              rolePermission.isActive ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {rolePermission.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No permissions assigned to this role
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
