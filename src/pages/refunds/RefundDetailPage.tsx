import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  BookOpen,
  CreditCard,
  Calendar,
  DollarSign,
  Hash,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGetRefundByIdQuery } from "@/services/refundsApi";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DetailsLoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import {
  formatCurrency,
  formatDateTime,
  getStatusVariant,
} from "@/lib/paymentUtils";
import { DetailsLoadingError } from "@/components/shared/LoadingError";

export const RefundDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetRefundByIdQuery(id!);

  if (isLoading) {
    return <DetailsLoadingSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-4 lg:p-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/refunds")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Refunds
        </Button>
        <DetailsLoadingError onRetry={() => refetch()} />
      </div>
    );
  }

  const refund = data.data;

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/admin/refunds")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Refunds
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Refund Details
          </h1>
          <p className="text-muted-foreground">
            Refund ID: <span className="font-mono">{refund.id}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(refund.status)}>
            {refund.status}
          </Badge>
          <span className="text-lg font-semibold">
            {formatCurrency(refund.amount)}
          </span>
        </div>
      </div>

      {/* Refund Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={refund.payment.user.thumbnailUrl}
                  alt={refund.payment.user.name}
                />
                <AvatarFallback>
                  {refund.payment.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{refund.payment.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {refund.payment.user.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  ID: {refund.payment.user.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <img
                src={refund.payment.course.thumbnailUrl}
                alt={refund.payment.course.title}
                className="w-16 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{refund.payment.course.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{refund.payment.course.level}</Badge>
                  <span className="text-sm font-medium">
                    {formatCurrency(refund.payment.course.price)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Course ID: {refund.payment.course.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructor Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Instructor Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={refund.payment.course.instructor.thumbnailUrl}
                  alt={refund.payment.course.instructor.name}
                />
                <AvatarFallback>
                  {refund.payment.course.instructor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {refund.payment.course.instructor.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {refund.payment.course.instructor.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  ID: {refund.payment.course.instructor.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Original Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Original Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Payment ID */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Payment ID</span>
              </div>
              <p className="text-sm font-mono">{refund.payment.id}</p>
            </div>

            {/* Payment Amount */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Payment Amount</span>
              </div>
              <p className="text-sm">
                {formatCurrency(refund.payment.amount, refund.payment.currency)}
              </p>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Payment Method</span>
              </div>
              <p className="text-sm capitalize">
                {refund.payment.paymentMethod}
              </p>
            </div>

            {/* Payment Status */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Payment Status</span>
              <div>
                <Badge variant={getStatusVariant(refund.payment.status)}>
                  {refund.payment.status}
                </Badge>
              </div>
            </div>

            {/* Payment Created */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Payment Created</span>
              </div>
              <p className="text-sm">
                {formatDateTime(refund.payment.createdAt)}
              </p>
            </div>

            {/* Payment Paid */}
            {refund.payment.paidAt && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Paid At</span>
                </div>
                <p className="text-sm">
                  {formatDateTime(refund.payment.paidAt)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Refund Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Refund Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Requested Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Requested At</span>
              </div>
              <p className="text-sm">{formatDateTime(refund.requestedAt)}</p>
            </div>

            {/* Processed Date */}
            {refund.processedAt && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Processed At</span>
                </div>
                <p className="text-sm">{formatDateTime(refund.processedAt)}</p>
              </div>
            )}

            {/* Refund Reason */}
            <div className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium">Refund Reason</span>
              <p className="text-sm bg-muted p-3 rounded-md">{refund.reason}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Information */}
      {(refund.payment.transactionId ||
        refund.payment.stripeSessionId ||
        refund.payment.receiptUrl ||
        refund.payment.card) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Transaction Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Transaction ID */}
              {refund.payment.transactionId && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Transaction ID</span>
                  </div>
                  <p className="text-xs font-mono break-all">
                    {refund.payment.transactionId}
                  </p>
                </div>
              )}

              {/* Stripe Session ID */}
              {refund.payment.stripeSessionId && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Stripe Session</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-xs font-mono text-ellipsis overflow-hidden whitespace-nowrap">
                        {refund.payment.stripeSessionId}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      {refund.payment.stripeSessionId}
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}

              {/* Receipt URL */}
              {refund.payment.receiptUrl && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Receipt</span>
                  </div>
                  <a
                    href={refund.payment.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Receipt
                  </a>
                </div>
              )}

              {/* Card Information */}
              {refund.payment.card && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Card</span>
                  </div>
                  <p className="text-sm">
                    {refund.payment.card.brand.toUpperCase()} ****{" "}
                    {refund.payment.card.last4}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expires{" "}
                    {refund.payment.card.expMonth.toString().padStart(2, "0")}/
                    {refund.payment.card.expYear}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
