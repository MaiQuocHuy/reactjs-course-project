import { format } from 'date-fns';
import { Eye, EyeOff, Mail, MoreHorizontal, Trash2 } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import type { Discount } from '@/types/discounts';

type Props = {
  discounts?: Discount[];
  onRowClick: (discount: Discount) => void;
  onDeleteDiscount: (e: React.MouseEvent, id: string) => void;
  onUpdateStatus: (e: React.MouseEvent, discount: Discount) => void;
  onSendEmail: (e: React.MouseEvent, discount: Discount) => void;
  isLoading: boolean;
};

const DiscountTable = ({
  discounts,
  onRowClick,
  onDeleteDiscount,
  onUpdateStatus,
  onSendEmail,
  isLoading,
}: Props) => {
  // Format date string
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">No.</TableHead>
            <TableHead className="w-[180px]">Code</TableHead>
            <TableHead className="text-center">Discount (%)</TableHead>
            <TableHead className="text-center">Type</TableHead>
            <TableHead className="text-center">Usage Limit</TableHead>
            <TableHead className="text-center">Per User Limit</TableHead>
            <TableHead className="text-center">Start Date</TableHead>
            <TableHead className="text-center">End Date</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {discounts?.map((discount, index) => (
            <TableRow
              key={discount.id}
              onClick={() => onRowClick(discount)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <TableCell className="font-medium text-center">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium ">
                <div className="truncate" title={discount.code}>
                  {discount.code}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {discount.discountPercent}%
              </TableCell>
              <TableCell className="text-center">{discount.type}</TableCell>
              <TableCell className="text-center">
                {discount.usageLimit ? discount.usageLimit : 'No Limit'}
              </TableCell>
              <TableCell className="text-center">
                {discount.perUserLimit ? discount.perUserLimit : 'No Limit'}
              </TableCell>
              <TableCell className="text-center">
                {formatDate(discount.startDate)}
              </TableCell>
              <TableCell className="text-center">
                {formatDate(discount.endDate)}
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    discount.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {discount.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isLoading}
                        className="cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(e, discount);
                        }}
                      >
                        {discount.isActive ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            <span>Deactivate</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            <span>Activate</span>
                          </>
                        )}
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSendEmail(e, discount);
                        }}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        <span>Send Email</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDiscount(e, discount.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DiscountTable;
