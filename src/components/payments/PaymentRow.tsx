import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { PaymentActions } from "./PaymentActions";
import type { PaymentResponse } from "@/types/payments";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  formatCurrency,
  formatDate,
  formatPaymentId,
  getStatusVariant,
} from "@/lib/paymentUtils";

interface PaymentRowProps {
  index: number;
  payment: PaymentResponse;
  style?: React.CSSProperties;
}

export const PaymentRow = ({ payment, style, index }: PaymentRowProps) => {
  return (
    <TableRow className="hover:bg-gray-200" style={style}>
      {/* No. */}
      <TableCell className="text-end">{index + 1}</TableCell>

      {/* Payment ID */}
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="font-mono text-xs bg-gray-200 px-2 py-1 rounded inline-block">
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

      {/* Created Date */}
      <TableCell>
        <div className="text-sm flex flex-col ">
          <span className="">Created:</span>
          <p className="">{formatDate(payment.createdAt)}</p>
        </div>
      </TableCell>

      {/* Paid Date */}
      <TableCell>
        {payment.paidAt ? (
          <div className="text-sm flex flex-col ">
            <span className="">Paid:</span>
            <p className="">{formatDate(payment.paidAt)}</p>
          </div>
        ) : (
          <Badge variant="secondary">Not Paid</Badge>
        )}
      </TableCell>

      {/* Paid out Date */}
      <TableCell>
        {payment.paidOutAt ? (
          <div className="text-sm flex flex-col ">
            <span className="">Paid Out:</span>
            <p className="">{formatDate(payment.paidOutAt)}</p>
          </div>
        ) : (
          <Badge variant="notPaid">Not Paid</Badge>
        )}
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
