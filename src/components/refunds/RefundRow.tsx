import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { RefundActions } from "./RefundActions";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { RefundResponse } from "@/types/refunds";
import {
  formatCurrency,
  formatDate,
  formatPaymentId,
  getStatusVariant,
} from "@/lib/paymentUtils";

interface RefundRowProps {
  index: number;
  refund: RefundResponse;
  style?: React.CSSProperties;
}

export const RefundRow = ({ refund, style, index }: RefundRowProps) => {
  return (
    <TableRow className="hover:bg-gray-200" style={style}>
      {/* No. */}
      <TableCell className="text-end">{index + 1}</TableCell>

      {/* Refund ID */}
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="font-mono text-xs bg-gray-200 px-2 py-1 rounded inline-block">
              {formatPaymentId(refund.id)}
            </div>
          </TooltipTrigger>
          <TooltipContent>{refund.id}</TooltipContent>
        </Tooltip>
      </TableCell>

      {/* User */}
      <TableCell>
        <span>{refund.payment.user?.name}</span>
      </TableCell>

      {/* Refund Amount */}
      <TableCell className="text-end">
        <span className="">{formatCurrency(refund.amount)}</span>
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

      {/* Requested Dates */}
      <TableCell className="w-[160px]">
        <div className="text-sm flex gap-2">
          <div>
            <p className="">Requested:</p>
            <p className="">{formatDate(refund.requestedAt)}</p>
          </div>
        </div>
      </TableCell>

      {/* Processed Dates */}
      <TableCell className="w-[160px]">
        <div className="text-sm flex gap-2">
          {refund.processedAt ? (
            <div>
              <p className="">Processed:</p>
              <p className="">{formatDate(refund.processedAt)}</p>
            </div>
          ) : (
            <Badge variant="notPaid">Not processed</Badge>
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
