import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { RefundActions } from "./RefundActions";
import type { RefundResponse } from "@/services/refundsApi";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block">
              {formatRefundId(refund.id)}
            </div>
          </TooltipTrigger>
          <TooltipContent>{refund.id}</TooltipContent>
        </Tooltip>
      </TableCell>

      {/* Payment ID */}
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block">
              {formatRefundId(refund.payment.id)}
            </div>
          </TooltipTrigger>
          <TooltipContent>{refund.payment.id}</TooltipContent>
        </Tooltip>
      </TableCell>

      {/* Refund Amount */}
      <TableCell className="text-end">
        <span className="font-medium">{formatCurrency(refund.amount)}</span>
      </TableCell>

      {/* Payment Amount */}
      <TableCell className="text-end">
        <span className="font-medium">
          {formatCurrency(refund.payment.amount)}
        </span>
      </TableCell>

      {/* Reason */}
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="min-w-0 max-w-[200px]">
              <p className="text-sm truncate">{refund.reason}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>{refund.reason}</TooltipContent>
        </Tooltip>
      </TableCell>

      {/* Rejected Reason */}
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="min-w-0 max-w-[200px]">
              <p className="text-sm truncate">{refund.rejectedReason}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>{refund.rejectedReason}</TooltipContent>
        </Tooltip>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge variant={getStatusVariant(refund.status)}>{refund.status}</Badge>
      </TableCell>

      {/* Dates */}
      <TableCell className="w-[160px]">
        <div className="text-sm flex gap-2">
          <div>
            <p className="font-medium">Requested:</p>
            <p className="font-medium">{formatDate(refund.requestedAt)}</p>
          </div>
          {refund.processedAt && (
            <div>
              <p className="font-medium">Processed:</p>
              <p className="font-medium">{formatDate(refund.processedAt)}</p>
            </div>
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
