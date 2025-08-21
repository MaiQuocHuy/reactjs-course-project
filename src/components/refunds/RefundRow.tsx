import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { RefundActions } from "./RefundActions";
import type { RefundResponse } from "@/services/refundsApi";

interface RefundRowProps {
  refund: RefundResponse;
  style?: React.CSSProperties;
}

const getStatusVariant = (status: string) => {
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

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
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

      {/* Payment ID */}
      <TableCell>
        <div className="font-mono text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block">
          {formatRefundId(refund.payment.id)}
        </div>
      </TableCell>

      {/* Refund Amount */}
      <TableCell>
        <span className="font-medium text-green-600">
          {formatCurrency(refund.amount)}
        </span>
      </TableCell>

      {/* Payment Amount */}
      <TableCell>
        <span className="font-medium text-muted-foreground">
          {formatCurrency(refund.payment.amount)}
        </span>
      </TableCell>

      {/* Reason */}
      <TableCell>
        <div className="min-w-0 max-w-[200px]">
          <p className="text-sm truncate" title={refund.reason}>
            {refund.reason}
          </p>
        </div>
      </TableCell>

      {/* Rejected Reason */}
      <TableCell>
        <div className="min-w-0 max-w-[200px]">
          <p
            className="text-sm truncate"
            title={refund.rejectedReason || undefined}
          >
            {refund.rejectedReason}
          </p>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge variant={getStatusVariant(refund.status)}>{refund.status}</Badge>
      </TableCell>

      {/* Dates */}
      <TableCell className="w-[160px]">
        <div className="text-sm">
          <p className="font-medium">Requested:</p>
          <p className="text-xs text-muted-foreground mb-1">
            {formatDate(refund.requestedAt)}
          </p>
          {refund.processedAt && (
            <>
              <p className="font-medium">Processed:</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(refund.processedAt)}
              </p>
            </>
          )}
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex justify-end">
          <RefundActions refund={refund} />
        </div>
      </TableCell>
    </TableRow>
  );
};
