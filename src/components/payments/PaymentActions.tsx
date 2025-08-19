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
import { useUpdatePaymentStatusMutation } from "@/services/paymentsApi";
import type { PaymentResponse } from "@/services/paymentsApi";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface PaymentActionsProps {
  payment: PaymentResponse;
}

export const PaymentActions = ({ payment }: PaymentActionsProps) => {
  const [updatePaymentStatus, { isLoading }] = useUpdatePaymentStatusMutation();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: "COMPLETED" | "FAILED" | null;
  }>({
    isOpen: false,
    action: null,
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/admin/payments/${payment.id}`);
  };

  const handleStatusUpdate = (newStatus: "COMPLETED" | "FAILED") => {
    setConfirmDialog({
      isOpen: true,
      action: newStatus,
    });
  };

  const confirmStatusUpdate = async () => {
    if (!confirmDialog.action) return;

    try {
      await updatePaymentStatus({
        id: payment.id,
        status: confirmDialog.action,
      }).unwrap();

      toast({
        title: "Success",
        description: `Payment status updated to ${confirmDialog.action.toLowerCase()}`,
      });

      setConfirmDialog({ isOpen: false, action: null });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  const isPending = payment.status === "PENDING";

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
                Mark as Completed
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleStatusUpdate("FAILED")}
                className="text-red-600"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Mark as Failed
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
            <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this payment as{" "}
              {confirmDialog.action?.toLowerCase()}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusUpdate}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
