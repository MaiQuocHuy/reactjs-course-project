import {
  MoreHorizontal,
  Eye,
  CreditCard,
  Calendar,
  DollarSign,
  User,
  BookOpen,
  Hash,
  GraduationCap,
  Mail,
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Payment } from "@/types/payments";
import { useState } from "react";

interface PaymentDetailsDropdownProps {
  payment: Payment;
}

const getStatusVariant = (status: Payment["status"]) => {
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

const formatDate = (date: Date | undefined) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const PaymentDetailsDropdown = ({
  payment,
}: PaymentDetailsDropdownProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = () => {
    setIsDialogOpen(true);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Status and Amount */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment Information
                </span>
                <Badge
                  variant={getStatusVariant(payment.status)}
                  className="ml-2"
                >
                  {payment.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Amount
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Payment Method
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <CreditCard className="h-4 w-4" />
                    <span className="capitalize font-medium">
                      {payment.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Payment ID
                  </p>
                  <p className="text-sm font-mono mt-1 break-all">
                    {payment.id}
                  </p>
                </div>
              </div>

              {payment.sessionId && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Session ID
                  </p>
                  <p className="text-sm font-mono bg-muted p-2 rounded mt-1 break-all">
                    {payment.sessionId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Information */}
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
                    src={payment.user.thumbnailUrl}
                    alt={payment.user.name}
                  />
                  <AvatarFallback>
                    {payment.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-medium">{payment.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {payment.user.email}
                  </p>
                  {payment.user.role && (
                    <Badge variant="outline" className="text-xs">
                      {payment.user.role.role}
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
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-lg">{payment.course.title}</p>
                {payment.course.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {payment.course.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Level
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {payment.course.level}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Price
                  </p>
                  <p className="font-medium mt-1">
                    {formatCurrency(payment.course.price || 0)}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Enhanced Instructor Information */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Course Instructor
                </p>
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={payment.course.instructor.thumbnailUrl}
                        alt={payment.course.instructor.name}
                      />
                      <AvatarFallback className="bg-primary/10">
                        {payment.course.instructor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base">
                        {payment.course.instructor.name}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground truncate">
                          {payment.course.instructor.email}
                        </p>
                      </div>
                      {payment.course.instructor.role && (
                        <Badge variant="secondary" className="text-xs mt-2">
                          {payment.course.instructor.role.role}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {payment.course.instructor.bio && (
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-sm text-muted-foreground">
                        <strong>Bio:</strong> {payment.course.instructor.bio}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-muted-foreground">
                    <div>
                      <p>Member since</p>
                      <p className="font-medium text-foreground">
                        {payment.course.instructor.createdAt
                          ? new Date(
                              payment.course.instructor.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p>Last updated</p>
                      <p className="font-medium text-foreground">
                        {payment.course.instructor.updatedAt
                          ? new Date(
                              payment.course.instructor.updatedAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
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
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">Payment Created</p>
                    <p className="text-xs text-muted-foreground">
                      Initial payment request
                    </p>
                  </div>
                  <p className="text-sm">{formatDate(payment.createdAt)}</p>
                </div>

                {payment.paidAt && (
                  <div className="flex items-center justify-between py-2 border-t">
                    <div>
                      <p className="text-sm font-medium">Payment Completed</p>
                      <p className="text-xs text-muted-foreground">
                        Transaction processed successfully
                      </p>
                    </div>
                    <p className="text-sm">{formatDate(payment.paidAt)}</p>
                  </div>
                )}

                <div className="flex items-center justify-between py-2 border-t">
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-xs text-muted-foreground">
                      Most recent modification
                    </p>
                  </div>
                  <p className="text-sm">{formatDate(payment.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
