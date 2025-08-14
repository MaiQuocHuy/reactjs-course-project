import {
  MoreHorizontal,
  Eye,
  Check,
  X,
  CreditCard,
  Calendar,
  DollarSign,
  User,
  BookOpen,
  Hash,
  GraduationCap,
  Mail,
  FileText,
  RefreshCw,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Refund } from "@/types/refunds";
import { useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { approveRefund, rejectRefund } from "@/features/refunds/refundsSlice";

interface RefundDropdownProps {
  refund: Refund;
}

const getStatusVariant = (status: Refund["status"]) => {
  switch (status) {
    case "COMPLETED":
      return "default" as const;
    case "PENDING":
      return "secondary" as const;
    case "FAILED":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (date: Date | undefined | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const RefundDropdown = ({ refund }: RefundDropdownProps) => {
  const dispatch = useAppDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const handleViewDetails = () => {
    setIsDialogOpen(true);
  };

  const handleApprove = () => {
    dispatch(approveRefund(refund.id));
    setIsApproveDialogOpen(false);
  };

  const handleReject = () => {
    dispatch(rejectRefund(refund.id));
    setIsRejectDialogOpen(false);
  };

  const canModifyStatus = refund.status === "PENDING";

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      >
        <AlertDialog
          open={isRejectDialogOpen}
          onOpenChange={setIsRejectDialogOpen}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-muted transition-colors"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem onClick={handleViewDetails}>
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </DropdownMenuItem>
              </DialogTrigger>
              {canModifyStatus && (
                <>
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onClick={() => setIsApproveDialogOpen(true)}
                      className="text-green-600 focus:text-green-600"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onClick={() => setIsRejectDialogOpen(true)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Refund Details Dialog */}
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Refund Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Refund Status and Amount */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5" />
                      Refund Information
                    </span>
                    <Badge
                      variant={getStatusVariant(refund.status)}
                      className="ml-2"
                    >
                      {refund.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Refund Amount
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(refund.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Original Amount
                      </p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(refund.payment.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Refund ID
                      </p>
                      <p className="text-sm font-mono mt-1 break-all">
                        {refund.id}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Reason
                    </p>
                    <p className="text-sm mt-1 bg-muted p-2 rounded">
                      {refund.reason}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Original Payment Information */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Original Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Payment Method
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <CreditCard className="h-4 w-4" />
                        <span className="capitalize font-medium">
                          {refund.payment.paymentMethod}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Payment Status
                      </p>
                      <Badge
                        variant={getStatusVariant(refund.payment.status)}
                        className="mt-1"
                      >
                        {refund.payment.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      Payment ID
                    </p>
                    <p className="text-sm font-mono mt-1 break-all">
                      {refund.payment.id}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Student Information */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={refund.payment.user.thumbnailUrl}
                        alt={refund.payment.user.name}
                      />
                      <AvatarFallback>
                        {refund.payment.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="font-medium">{refund.payment.user.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {refund.payment.user.email}
                      </p>
                      {refund.payment.user.role && (
                        <Badge variant="outline" className="text-xs">
                          <GraduationCap className="h-3 w-3 mr-1" />
                          {refund.payment.user.role.role}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Information */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Course Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <img
                      src={refund.payment.course.thumbnailUrl}
                      alt={refund.payment.course.title}
                      className="w-16 h-12 object-cover rounded-md"
                    />
                    <div className="space-y-2 flex-1">
                      <h4 className="font-medium">
                        {refund.payment.course.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {refund.payment.course.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {refund.payment.course.level}
                        </Badge>
                        <span className="text-sm font-medium">
                          {formatCurrency(refund.payment.course.price || 0)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Instructor: {refund.payment.course.instructor.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Payment Created
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(refund.payment.createdAt)}
                      </span>
                    </div>
                    <Separator />
                    {refund.payment.paidAt && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Payment Completed
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(refund.payment.paidAt)}
                          </span>
                        </div>
                        <Separator />
                      </>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Refund Requested
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(refund.requestedAt)}
                      </span>
                    </div>
                    {refund.processedAt && (
                      <>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Refund Processed
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(refund.processedAt)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>

          {/* Approve Confirmation Dialog */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Refund</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to approve this refund of{" "}
                {formatCurrency(refund.amount)}
                for {refund.payment.user.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve Refund
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>

          {/* Reject Confirmation Dialog */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Refund</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reject this refund request from{" "}
                {refund.payment.user.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-700"
              >
                Reject Refund
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AlertDialog>
    </Dialog>
  );
};
