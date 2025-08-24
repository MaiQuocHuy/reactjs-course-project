import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { PaymentActions } from "./PaymentActions";
import type { PaymentResponse } from "@/types/payments";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block">
              {formatPaymentId(payment.id)}
            </div>
          </TooltipTrigger>
          <TooltipContent>{payment.id}</TooltipContent>
        </Tooltip>
      </TableCell>

      {/* User */}
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="min-w-0">
            <p className=" text-sm truncate">{payment.user.name}</p>
          </div>
        </div>
      </TableCell>

      {/* Course */}
      <TableCell>
        <div className="min-w-0">
          <p className=" text-sm truncate" title={payment.course.title}>
            {payment.course.title}
          </p>
        </div>
      </TableCell>

      {/* Amount */}
      <TableCell className="text-end">
        <span className="">
          {formatCurrency(payment.amount, payment.currency)}
        </span>
      </TableCell>

      {/* Payment Method */}
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="text-sm capitalize">{payment.paymentMethod}</span>
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
        <div className="text-sm space-y-1 flex gap-2">
          <div>
            <div>
              <span className="">Created:</span>
              <p className="">{formatDate(payment.createdAt)}</p>
            </div>
          </div>
          {payment.paidAt && (
            <div>
              <span className="">Paid:</span>
              <p className="">{formatDate(payment.paidAt)}</p>
            </div>
          )}
          {payment.paidOutAt && (
            <div>
              <span className="">Paid Out:</span>
              <p className="">{formatDate(payment.paidOutAt)}</p>
            </div>
          )}
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex">
          <PaymentActions payment={payment} />
        </div>
      </TableCell>
    </TableRow>
  );
};
