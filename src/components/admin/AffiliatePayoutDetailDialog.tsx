import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetAffiliatePayoutDetailQuery } from "@/services/affiliateApi";
import {
  Loader2,
  Eye,
  User,
  GraduationCap,
  DollarSign,
  Tag,
} from "lucide-react";

interface AffiliatePayoutDetailDialogProps {
  payoutId: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AffiliatePayoutDetailDialog: React.FC<
  AffiliatePayoutDetailDialogProps
> = ({ payoutId, trigger, open: controlledOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const {
    data: detailResponse,
    isLoading,
    error,
  } = useGetAffiliatePayoutDetailQuery(payoutId, {
    skip: !open,
  });

  const detail = detailResponse?.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Affiliate Payout Details
          </DialogTitle>
          <DialogDescription>
            Comprehensive information about affiliate commission payout #
            {payoutId.slice(-8)}
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading payout details...
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load payout details</p>
          </div>
        )}

        {detail && (
          <div className="space-y-6">
            {/* Payout Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Payout Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(detail.payoutStatus)}>
                    {detail.payoutStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Commission Amount
                  </p>
                  <p className="font-semibold text-lg text-green-600">
                    {formatCurrency(detail.commissionAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Commission Rate
                  </p>
                  <p className="font-semibold">{detail.commissionPercent}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created Date</p>
                  <p className="font-medium">{formatDate(detail.createdAt)}</p>
                </div>
                {detail.paidAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Paid Date</p>
                    <p className="font-medium text-green-600">
                      {formatDate(detail.paidAt)}
                    </p>
                  </div>
                )}
                {detail.cancelledAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Cancelled Date
                    </p>
                    <p className="font-medium text-red-600">
                      {formatDate(detail.cancelledAt)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Referrer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Referrer (Commission Recipient)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{detail.referrer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{detail.referrer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Member Since
                    </p>
                    <p className="font-medium">
                      {formatDate(detail.referrer.joinedAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Purchaser Information */}
              {detail.purchaser && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Course Purchaser
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{detail.purchaser.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{detail.purchaser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Member Since
                      </p>
                      <p className="font-medium">
                        {formatDate(detail.purchaser.joinedAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Usage Information */}
              {detail.usageInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Transaction Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Original Price
                      </p>
                      <p className="font-medium">
                        {formatCurrency(detail.usageInfo.originalCoursePrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Discount Applied
                      </p>
                      <p className="font-medium text-green-600">
                        -{formatCurrency(detail.usageInfo.discountAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Final Price
                      </p>
                      <p className="font-semibold text-lg">
                        {formatCurrency(detail.usageInfo.finalPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Used Date</p>
                      <p className="font-medium">
                        {formatDate(detail.usageInfo.usedAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Course Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Course Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Course Title
                    </p>
                    <p className="font-semibold">{detail.course.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-semibold text-lg">
                      {formatCurrency(detail.course.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                    <p className="font-medium">
                      {detail.course.instructorName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {detail.course.instructorEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Course Status
                    </p>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          detail.course.isPublished ? "default" : "secondary"
                        }
                      >
                        {detail.course.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Badge
                        variant={
                          detail.course.isApproved ? "default" : "destructive"
                        }
                      >
                        {detail.course.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>
                {detail.course.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm">{detail.course.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">
                    Course Created
                  </p>
                  <p className="font-medium">
                    {formatDate(detail.course.courseCreatedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Discount Information */}
            {detail.discount && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Discount Code Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Discount Code
                      </p>
                      <Badge variant="outline" className="font-mono text-lg">
                        {detail.discount.code}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <Badge>{detail.discount.type}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Discount Rate
                      </p>
                      <p className="font-semibold">
                        {detail.discount.discountPercent}%
                      </p>
                    </div>
                  </div>
                  {detail.discount.description && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Description
                      </p>
                      <p className="text-sm">{detail.discount.description}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Valid Period
                      </p>
                      <p className="font-medium">
                        {detail.discount.startDate
                          ? formatDate(detail.discount.startDate)
                          : "No start date"}{" "}
                        -
                        {detail.discount.endDate
                          ? formatDate(detail.discount.endDate)
                          : "No end date"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Usage Limits
                      </p>
                      <p className="font-medium">
                        Total: {detail.discount.usageLimit || "Unlimited"} | Per
                        User: {detail.discount.perUserLimit || "Unlimited"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                      variant={
                        detail.discount.isActive ? "default" : "secondary"
                      }
                    >
                      {detail.discount.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
