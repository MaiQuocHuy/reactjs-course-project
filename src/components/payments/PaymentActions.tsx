import { useState } from "react";
import {
  Eye,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  DollarSign,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useUpdatePaymentStatusMutation,
  usePaidOutPaymentMutation,
} from "@/services/paymentsApi";
import type { PaymentResponse } from "@/types/payments";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface PaymentActionsProps {
  payment: PaymentResponse;
}

export const PaymentActions = ({ payment }: PaymentActionsProps) => {
  const [updatePaymentStatus, { isLoading }] = useUpdatePaymentStatusMutation();
  const [paidOutPayment, { isLoading: isPaidOutLoading }] =
    usePaidOutPaymentMutation();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: "COMPLETED" | "FAILED" | "PAID_OUT" | null;
  }>({
    isOpen: false,
    action: null,
  });
  const [paidOutDialog, setPaidOutDialog] = useState<{
    isOpen: boolean;
    data: any;
  }>({
    isOpen: false,
    data: null,
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

  const handlePaidOut = () => {
    setConfirmDialog({
      isOpen: true,
      action: "PAID_OUT",
    });
  };

  const confirmStatusUpdate = async () => {
    if (!confirmDialog.action) return;

    try {
      if (confirmDialog.action === "PAID_OUT") {
        const result = await paidOutPayment(payment.id).unwrap();

        // Show success dialog with auto-close after 3 seconds
        setPaidOutDialog({
          isOpen: true,
          data: result.data,
        });

        // Auto close after 3 seconds
        setTimeout(() => {
          setPaidOutDialog({ isOpen: false, data: null });
        }, 3000);

        toast({
          title: "Success",
          description: result.message || "Payment paid out successfully",
        });
      } else {
        await updatePaymentStatus({
          id: payment.id,
          status: confirmDialog.action,
        }).unwrap();

        toast({
          title: "Success",
          description: `Payment status updated to ${confirmDialog.action.toLowerCase()}`,
        });
      }

      setConfirmDialog({ isOpen: false, action: null });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.data.message ||
          `Failed to ${
            confirmDialog.action === "PAID_OUT" ? "paid out" : "update"
          } payment`,
        variant: "destructive",
      });
    }
  };

  const isPending = payment.status === "PENDING";
  const isCompleted = payment.status === "COMPLETED";
  const canPaidOut = isCompleted && !payment.paidOutAt;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-muted transition-colors"
            disabled={isLoading || isPaidOutLoading}
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

          {canPaidOut && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handlePaidOut}
                className="text-blue-600"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Paid Out
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
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.action === "PAID_OUT"
                ? "Are you sure you want to paid out this payment? The instructor will receive their earnings."
                : `Are you sure you want to mark this payment as ${confirmDialog.action?.toLowerCase()}? This action cannot be undone.`}
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

      {/* Paid Out Success Dialog */}
      <Dialog
        open={paidOutDialog.isOpen}
        onOpenChange={(open) => setPaidOutDialog({ isOpen: open, data: null })}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-600">
              Payment Paid Out Successfully!
            </DialogTitle>
            <DialogDescription>
              The payment has been processed and the instructor will receive
              their earnings.
            </DialogDescription>
          </DialogHeader>
          {paidOutDialog.data && (
            <div className="space-y-3 pt-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Course:</span>
                <span className="font-medium">
                  {paidOutDialog.data.courseTitle}
                </span>

                <span className="text-muted-foreground">Instructor:</span>
                <span className="font-medium">
                  {paidOutDialog.data.instructorName}
                </span>

                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">
                  ${paidOutDialog.data.amount}
                </span>

                <span className="text-muted-foreground">
                  Instructor Earning:
                </span>
                <span className="font-medium text-green-600">
                  ${paidOutDialog.data.instructorEarning}
                </span>
              </div>
              <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                {paidOutDialog.data.message}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
