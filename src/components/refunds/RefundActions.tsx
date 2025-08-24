import { useState } from "react";
import { Eye, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateRefundStatusMutation } from "@/services/refundsApi";
import { useNavigate } from "react-router-dom";
import type { RefundResponse } from "@/types/refunds";

interface RefundActionsProps {
  refund: RefundResponse;
}

export const RefundActions = ({ refund }: RefundActionsProps) => {
  const [updateRefundStatus, { isLoading }] = useUpdateRefundStatusMutation();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: "COMPLETED" | "FAILED" | null;
  }>({
    isOpen: false,
    action: null,
  });
  const [failureReason, setFailureReason] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/admin/refunds/${refund.id}`);
  };

  const handleStatusUpdate = (newStatus: "COMPLETED" | "FAILED") => {
    setConfirmDialog({
      isOpen: true,
      action: newStatus,
    });
    if (newStatus === "FAILED") {
      setFailureReason("");
    }
  };

  const confirmStatusUpdate = async () => {
    if (!confirmDialog.action) return;

    try {
      const payload: {
        id: string;
        status: "COMPLETED" | "FAILED";
        rejectedReason?: string;
      } = {
        id: refund.id,
        status: confirmDialog.action,
      };

      if (confirmDialog.action === "FAILED" && failureReason.trim()) {
        payload.rejectedReason = failureReason.trim();
      }

      await updateRefundStatus(payload).unwrap();

      toast({
        title: "Success",
        description: `Refund status updated to ${confirmDialog.action.toLowerCase()}`,
      });

      setConfirmDialog({ isOpen: false, action: null });
      setFailureReason("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update refund status",
        variant: "destructive",
      });
    }
  };

  const isPending = refund.status === "PENDING";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-muted transition-colors"
            disabled={isLoading}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleViewDetails}>
            <Eye className="mr-2 h-4 w-4" />
            View details
          </DropdownMenuItem>

          {isPending && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleStatusUpdate("COMPLETED")}
                className="text-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Refund
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleStatusUpdate("FAILED")}
                className="text-red-600"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Refund
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) =>
          setConfirmDialog({ isOpen: open, action: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Refund Status Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {confirmDialog.action === "COMPLETED" ? "approve" : "reject"} this
              refund?
              {confirmDialog.action === "COMPLETED"
                ? " The refund amount will be processed back to the customer."
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {confirmDialog.action === "FAILED" && (
            <div className="space-y-2">
              <Label htmlFor="failure-reason">
                Reason for rejection (optional)
              </Label>
              <Textarea
                id="failure-reason"
                placeholder="Enter reason for rejecting the refund..."
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusUpdate}>
              {confirmDialog.action === "COMPLETED" ? "Approve" : "Reject"}{" "}
              Refund
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
