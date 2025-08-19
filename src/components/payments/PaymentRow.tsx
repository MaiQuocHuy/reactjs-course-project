import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { PaymentActions } from "./PaymentActions";
import type { PaymentResponse } from "@/services/paymentsApi";

interface PaymentRowProps {
  payment: PaymentResponse;
  style?: React.CSSProperties;
}

const getStatusVariant = (status: PaymentResponse["status"]) => {
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

const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatPaymentId = (id: string) => {
  return id.slice(0, 8).toUpperCase();
};

export const PaymentRow = ({ payment, style }: PaymentRowProps) => {
  return (
    <TableRow className="hover:bg-muted/50" style={style}>
      {/* Payment ID */}
      <TableCell>
        <div className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block">
          {formatPaymentId(payment.id)}
        </div>
      </TableCell>

      {/* User */}
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{payment.user.name}</p>
          </div>
        </div>
      </TableCell>

      {/* Course */}
      <TableCell>
        <div className="min-w-0">
          <p
            className="font-medium text-sm truncate"
            title={payment.course.title}
          >
            {payment.course.title}
          </p>
        </div>
      </TableCell>

      {/* Amount */}
      <TableCell>
        <span className="font-medium">
          {formatCurrency(payment.amount, payment.currency)}
        </span>
      </TableCell>

      {/* Payment Method */}
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium capitalize">
            {payment.paymentMethod}
          </span>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge variant={getStatusVariant(payment.status)}>
          {payment.status}
        </Badge>
      </TableCell>

      {/* Date */}
      <TableCell>
        <div className="text-sm">
          <p>{formatDate(payment.createdAt)}</p>
          {payment.paidAt && payment.status === "COMPLETED" && (
            <p className="text-xs text-muted-foreground">
              Paid: {formatDate(payment.paidAt)}
            </p>
          )}
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex justify-end">
          <PaymentActions payment={payment} />
        </div>
      </TableCell>
    </TableRow>
  );
};
