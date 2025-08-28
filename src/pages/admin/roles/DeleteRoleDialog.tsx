import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import type { RoleWithPermissions } from "@/services/rolesApi";

interface DeleteRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleWithPermissions;
  onConfirm: () => void;
}

export const DeleteRoleDialog: React.FC<DeleteRoleDialogProps> = ({
  open,
  onOpenChange,
  role,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Role
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the role
            and remove all associated permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">
              You are about to delete:
            </h4>
            <div className="space-y-1 text-sm text-red-700">
              <p>
                <strong>Role:</strong> {role.name}
              </p>
              <p>
                <strong>Permissions:</strong> {role.permissions?.length || 0}
              </p>
              <p>
                <strong>Users affected:</strong> {role.totalUsers || 0}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Delete Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
