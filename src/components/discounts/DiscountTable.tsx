import { useState } from 'react';
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
import {
  useDeleteDiscountMutation,
  useUpdateDiscountStatusMutation,
} from '@/services/discountsApi';
import { toast } from 'sonner';
import WarningAlert from './WarningAlert';

type Props = {
  discounts?: Discount[];
  onRowClick: (discount: Discount) => void;
  onSendEmail: (e: React.MouseEvent, discount: Discount) => void;
};

const DiscountTable = ({ discounts, onRowClick, onSendEmail }: Props) => {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [alertDialogProps, setAlertDialogProps] = useState({
    title: '',
    description: '',
    action: () => {},
  });

  // Update discount status mutation
  const [updateDiscountStatus, { isLoading: isUpdating }] =
    useUpdateDiscountStatusMutation();

  // Delete discount mutation
  const [deleteDiscount, { isLoading: isDeleting }] =
    useDeleteDiscountMutation();

  // Format date string
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Check if date is expired
  const isDateExpired = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Set to end of today
      return date < today;
    } catch (e) {
      return false;
    }
  };

  // Handle update discount status
  const handleUpdateStatus = (e: React.MouseEvent, discount: Discount) => {
    e.stopPropagation(); // Prevent row click from triggering

    const newStatus = !discount.isActive;
    const message = newStatus ? 'activate' : 'deactivate';

    setAlertDialogProps({
      title: `${newStatus ? 'Activate' : 'Deactivate'} Discount`,
      description: `Are you sure you want to ${message} this discount?`,
      action: async () => {
        try {
          await updateDiscountStatus({
            id: discount.id,
            isActive: newStatus,
          }).unwrap();
          toast.success(
            `Discount ${newStatus ? 'activated' : 'deactivated'} successfully`
          );
        } catch (error) {
          console.error('Failed to update discount status:', error);
          toast.error('Failed to update discount status');
        }
      },
    });
    setIsAlertDialogOpen(true);
  };

  // Handle delete discount
  const handleDeleteDiscount = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent row click from triggering

    setAlertDialogProps({
      title: 'Delete Discount',
      description:
        'Are you sure you want to delete this discount? This action cannot be undone.',
      action: async () => {
        try {
          await deleteDiscount(id).unwrap();
          toast.success('Discount deleted successfully');
        } catch (error) {
          console.error('Failed to delete discount:', error);
          toast.error('Failed to delete discount');
        }
      },
    });
    setIsAlertDialogOpen(true);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">No.</TableHead>
            <TableHead className="w-[180px]">Code</TableHead>
            <TableHead className="text-center">Type</TableHead>
            <TableHead className="text-center">Discount (%)</TableHead>
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
              {/* Order */}
              <TableCell className="font-medium text-center">
                {index + 1}
              </TableCell>

              {/* Code */}
              <TableCell className="font-medium ">
                <div className="truncate" title={discount.code}>
                  {discount.code}
                </div>
              </TableCell>

              {/* Type */}
              <TableCell className="text-center">{discount.type}</TableCell>

              {/* Discount Percent */}
              <TableCell className="text-center">
                {discount.discountPercent}%
              </TableCell>

              {/* Usage Limit & Per User Limit */}
              <TableCell className="text-center">
                {discount.usageLimit ? discount.usageLimit : 'No Limit'}
              </TableCell>
              <TableCell className="text-center">
                {discount.perUserLimit ? discount.perUserLimit : 'No Limit'}
              </TableCell>

              {/* Start Date & End Date */}
              <TableCell className="text-center">
                {formatDate(discount.startDate)}
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={
                    isDateExpired(discount.endDate)
                      ? 'text-red-600 font-medium'
                      : ''
                  }
                >
                  {formatDate(discount.endDate)}
                </span>
              </TableCell>

              {/* Status */}
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

              {/* Actions */}
              <TableCell>
                <div className="flex justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isUpdating || isDeleting}
                        className="cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {/* Update Status */}
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(e, discount);
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

                      {/* Send Email */}
                      {discount.type === 'GENERAL' && (
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
                      )}
                      <DropdownMenuSeparator />

                      {/* Delete Discount */}
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDiscount(e, discount.id);
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

      {/* Confirmation Alert Dialog */}
      <WarningAlert
        isAlertDialogOpen={isAlertDialogOpen}
        setIsAlertDialogOpen={setIsAlertDialogOpen}
        alertDialogProps={alertDialogProps}
      />
    </div>
  );
};

export default DiscountTable;
