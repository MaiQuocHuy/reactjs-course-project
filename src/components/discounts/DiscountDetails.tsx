import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import type { Discount } from '@/types/discounts';

type Props = {
  isLoadingDetails: boolean;
  isDialogOpen: boolean;
  onDialogOpen: (open: boolean) => void;
  selectedDiscount: Discount | undefined;
};

const DiscountDetails = (props: Props) => {
  const { isLoadingDetails, isDialogOpen, onDialogOpen, selectedDiscount } =
    props;
  // Format date string
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={onDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Discount Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected discount.
          </DialogDescription>
        </DialogHeader>

        {isLoadingDetails ? (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading details...</span>
          </div>
        ) : selectedDiscount ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="text-sm font-medium">Code:</div>
              <div className="text-sm">{selectedDiscount.code}</div>

              <div className="text-sm font-medium">Type:</div>
              <div className="text-sm">{selectedDiscount.type}</div>

              <div className="text-sm font-medium">Discount:</div>
              <div className="text-sm">{selectedDiscount.discountPercent}%</div>

              <div className="text-sm font-medium">Description:</div>
              <div className="text-sm">{selectedDiscount.description}</div>

              <div className="text-sm font-medium">Valid Period:</div>
              <div className="text-sm">
                {formatDate(selectedDiscount.startDate)} to{' '}
                {formatDate(selectedDiscount.endDate)}
              </div>

              <div className="text-sm font-medium">Usage Limit:</div>
              <div className="text-sm">
                {selectedDiscount.usageLimit
                  ? selectedDiscount.usageLimit
                  : 'No Limit'}
              </div>

              <div className="text-sm font-medium">Per User Limit:</div>
              <div className="text-sm">
                {selectedDiscount.perUserLimit
                  ? selectedDiscount.perUserLimit
                  : 'No Limit'}
              </div>

              <div className="text-sm font-medium">Current Usage:</div>
              <div className="text-sm">
                {selectedDiscount.currentUsageCount}
              </div>

              <div className="text-sm font-medium">Status:</div>
              <div className="text-sm">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedDiscount.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {selectedDiscount.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="text-sm font-medium">Start At:</div>
              <div className="text-sm">
                {formatDate(selectedDiscount.startDate)}
              </div>

              <div className="text-sm font-medium">End At:</div>
              <div className="text-sm">
                {formatDate(selectedDiscount.endDate)}
              </div>

              <div className="text-sm font-medium">Created At:</div>
              <div className="text-sm">
                {formatDate(selectedDiscount.createdAt)}
              </div>

              <div className="text-sm font-medium">Updated At:</div>
              <div className="text-sm">
                {formatDate(selectedDiscount.updatedAt)}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">No discount details available</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DiscountDetails;
