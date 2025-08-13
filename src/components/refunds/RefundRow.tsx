import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { RefundDropdown } from "./RefundDropdown";
import type { Refund } from "@/types/refunds";

interface RefundRowProps {
  refund: Refund;
  style?: React.CSSProperties;
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
    month: "short",
    day: "numeric",
  });
};

const formatRefundId = (id: string) => {
  return id.slice(0, 8).toUpperCase();
};

export const RefundRow = ({ refund, style }: RefundRowProps) => {
  return (
    <TableRow className="hover:bg-muted/50" style={style}>
      {/* Refund ID */}
      <TableCell>
        <div className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block">
          {formatRefundId(refund.id)}
        </div>
      </TableCell>

      {/* User */}
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">
              {refund.payment.user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {refund.payment.user.email}
            </p>
          </div>
        </div>
      </TableCell>

      {/* Course */}
      <TableCell>
        <div className="min-w-0">
          <p
            className="font-medium text-sm truncate"
            title={refund.payment.course.title}
          >
            {refund.payment.course.title}
          </p>
          <p className="text-xs text-muted-foreground">
            Original: {formatCurrency(refund.payment.amount)}
          </p>
        </div>
      </TableCell>

      {/* Refund Amount */}
      <TableCell>
        <span className="font-medium text-green-600">
          {formatCurrency(refund.amount)}
        </span>
      </TableCell>

      {/* Payment Method */}
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium capitalize">
            {refund.payment.paymentMethod}
          </span>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge variant={getStatusVariant(refund.status)}>{refund.status}</Badge>
      </TableCell>

      {/* Reason */}
      <TableCell>
        <div className="max-w-[200px]">
          <p className="text-sm truncate" title={refund.reason}>
            {refund.reason}
          </p>
        </div>
      </TableCell>

      {/* Date */}
      <TableCell>
        <div className="text-sm">
          <p>{formatDate(refund.requestedAt)}</p>
          {refund.processedAt && refund.status !== "PENDING" && (
            <p className="text-xs text-muted-foreground">
              Processed: {formatDate(refund.processedAt)}
            </p>
          )}
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex justify-end">
          <RefundDropdown refund={refund} />
        </div>
      </TableCell>
    </TableRow>
  );
};
