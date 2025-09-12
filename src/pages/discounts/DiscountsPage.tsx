import React, { useState } from 'react';

import { Pagination } from '@/components/shared/Pagination';
import {
  useGetAllDiscountsQuery,
  useGetDiscountByIdQuery,
  useDeleteDiscountMutation,
  useUpdateDiscountStatusMutation,
} from '@/services/discountsApi';
import type { Discount } from '@/types/discounts';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Loader2, PlusCircle } from 'lucide-react';
import CreateDiscountDialog from '@/components/discounts/CreateDiscountDialog';
import { toast } from 'sonner';
import DiscountTable from '@/components/discounts/DiscountTable';
import DiscountDetails from '@/components/discounts/DiscountDetails';

const DiscountsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('DESC');
  const [selectedDiscountId, setSelectedDiscountId] = useState<string | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Alert dialog states
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [alertDialogProps, setAlertDialogProps] = useState({
    title: '',
    description: '',
    action: () => {},
  });

  // Fetch discounts with pagination
  const {
    data: discounts,
    isLoading: isLoadingDiscounts,
    error,
  } = useGetAllDiscountsQuery({
    page,
    size: pageSize,
    sortBy: 'createdAt',
    sortDir,
  });

  // Fetch selected discount details
  const { data: selectedDiscount, isLoading: isLoadingDetails } =
    useGetDiscountByIdQuery(selectedDiscountId || '', {
      skip: !selectedDiscountId,
    });

  // Delete discount mutation
  const [deleteDiscount, { isLoading: isDeleting }] =
    useDeleteDiscountMutation();

  // Update discount status mutation
  const [updateDiscountStatus, { isLoading: isUpdating }] =
    useUpdateDiscountStatusMutation();

  // Combine loading states
  const isLoading = isLoadingDiscounts;

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle items per page change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(0); // Reset to first page when changing page size
  };

  // Handle sort direction change
  const toggleSortDirection = () => {
    setSortDir(sortDir === 'DESC' ? 'ASC' : 'DESC');
  };

  // Handle row click
  const handleRowClick = (discount: Discount) => {
    setSelectedDiscountId(discount.id);
    setIsDialogOpen(true);
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

  // Handle update discount status
  const handleUpdateClick = (e: React.MouseEvent, discount: Discount) => {
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

  // Handle send email about discount
  const handleSendEmail = (e: React.MouseEvent, discount: Discount) => {
    e.stopPropagation(); // Prevent row click from triggering

    toast.info(
      `Send email feature for discount ${discount.code} will be implemented soon`
    );
  };

  if (isLoadingDiscounts) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading discounts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading discounts. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Discount Management</h1>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2 cursor-pointer"
          disabled={isLoading}
        >
          <PlusCircle size={16} />
          <span>Create Discount</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Available Discounts</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortDirection}
            className="flex items-center gap-2 cursor-pointer"
            disabled={isLoading}
          >
            <span>Date</span>
            <ArrowUpDown
              className={sortDir === 'DESC' ? 'transform rotate-180' : ''}
              size={16}
            />
            <span className="sr-only">
              {sortDir === 'DESC' ? 'Sort ascending' : 'Sort descending'}
            </span>
          </Button>
        </div>

        <div>
          <DiscountTable
            discounts={discounts?.content}
            onRowClick={handleRowClick}
            onDeleteDiscount={handleDeleteDiscount}
            onUpdateStatus={handleUpdateClick}
            onSendEmail={handleSendEmail}
            isLoading={isUpdating || isDeleting}
          />

          {/* Pagination component */}
          {discounts && discounts.page && discounts.page.totalPages >= 1 && (
            <Pagination
              currentPage={page}
              itemsPerPage={pageSize}
              pageInfo={discounts.page}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>

      {/* Discount Detail Dialog */}
      <DiscountDetails
        isLoadingDetails={isLoadingDetails}
        isDialogOpen={isDialogOpen}
        onDialogOpen={(open) => setIsDialogOpen(open)}
        selectedDiscount={selectedDiscount}
      />

      {/* Create Discount Dialog */}
      <CreateDiscountDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />

      {/* Confirmation Alert Dialog */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertDialogProps.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertDialogProps.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                alertDialogProps.action();
                setIsAlertDialogOpen(false);
              }}
              className="cursor-pointer"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DiscountsPage;
