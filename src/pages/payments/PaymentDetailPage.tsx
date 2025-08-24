import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  BookOpen,
  CreditCard,
  Calendar,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGetPaymentByIdQuery } from "@/services/paymentsApi";
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

export const PaymentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetPaymentByIdQuery(id!);

  if (isLoading) {
    return <DetailsLoadingSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-4 lg:p-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/payments")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payments
        </Button>

        <DetailsLoadingError onRetry={() => refetch()} />
      </div>
    );
  }

  const payment = data.data;

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/admin/payments")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Payments
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Payment Details
          </h1>
          <p className="text-muted-foreground">
            Payment ID: <span className="font-mono">{payment.id}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(payment.status)}>
            {payment.status}
          </Badge>
          <span className="text-lg font-semibold">
            {formatCurrency(payment.amount, payment.currency)}
          </span>
        </div>
      </div>

      {/* Payment Information Grid */}
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
                  src={payment.user.thumbnailUrl}
                  alt={payment.user.name}
                />
                <AvatarFallback>
                  {payment.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{payment.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {payment.user.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  ID: {payment.user.id}
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
                src={payment.course.thumbnailUrl}
                alt={payment.course.title}
                className="w-16 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{payment.course.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{payment.course.level}</Badge>
                  <span className="text-sm font-medium">
                    {formatCurrency(payment.course.price)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Course ID: {payment.course.id}
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
                  src={payment.course.instructor.thumbnailUrl}
                  alt={payment.course.instructor.name}
                />
                <AvatarFallback>
                  {payment.course.instructor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{payment.course.instructor.name}</p>
                <p className="text-sm text-muted-foreground">
                  {payment.course.instructor.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  ID: {payment.course.instructor.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Payment Method */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Payment Method</span>
              </div>
              <p className="text-sm capitalize">{payment.paymentMethod}</p>
            </div>

            {/* Card Information */}
            {payment.card && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Card</span>
                </div>
                <p className="text-sm capitalize">
                  {payment.card.brand} **** {payment.card.last4}
                </p>
                <p className="text-xs text-muted-foreground">
                  Expires: {payment.card.expMonth}/{payment.card.expYear}
                </p>
              </div>
            )}

            {/* Created Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Created</span>
              </div>
              <p className="text-sm">{formatDateTime(payment.createdAt)}</p>
            </div>

            {/* Paid Date */}
            {payment.paidAt && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Paid At</span>
                </div>
                <p className="text-sm">{formatDateTime(payment.paidAt)}</p>
              </div>
            )}

            {/* Paid Out Date */}
            {payment.paidoutAt && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Paid Out At</span>
                </div>
                <p className="text-sm">{formatDateTime(payment.paidoutAt)}</p>
              </div>
            )}

            {/* Transaction ID */}
            {payment.transactionId && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Transaction ID</span>
                </div>
                <p className="text-xs font-mono">{payment.transactionId}</p>
              </div>
            )}

            {/* Stripe Session ID */}
            {payment.stripeSessionId && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Stripe Session</span>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs font-mono text-ellipsis overflow-hidden whitespace-nowrap">
                      {payment.stripeSessionId}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>{payment.stripeSessionId}</TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Receipt URL */}
            {payment.receiptUrl && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Receipt</span>
                </div>
                <a
                  href={payment.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline "
                >
                  View Receipt
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
