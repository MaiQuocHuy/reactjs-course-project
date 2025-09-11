import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/shared/Pagination';
import {
  useGetAllDiscountsQuery,
  useGetDiscountByIdQuery,
  useDeleteDiscountMutation,
  useUpdateDiscountStatusMutation,
} from '@/services/discountsApi';
import type { Discount } from '@/types/discounts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  ArrowUpDown,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  MoreHorizontal,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import CreateDiscountDialog from '@/components/discounts/CreateDiscountDialog';
import { toast } from 'sonner';

const DiscountsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('DESC');
  const [selectedDiscountId, setSelectedDiscountId] = useState<string | null>(
    null
  );
  // const [isLoading, setIsLoading] = useState(false);
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
  const isLoading = isLoadingDiscounts || isDeleting || isUpdating;

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

  // Format date string
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

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

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading discounts...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            Error loading discounts. Please try again later.
          </div>
        ) : (
          <>
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
                {discounts?.content.map((discount, index) => (
                  <TableRow
                    key={discount.id}
                    onClick={() => handleRowClick(discount)}
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
                    <TableCell className="text-center">
                      {discount.type}
                    </TableCell>
                    <TableCell className="text-center">
                      {discount.usageLimit ? discount.usageLimit : 'No Limit'}
                    </TableCell>
                    <TableCell className="text-center">
                      {discount.perUserLimit
                        ? discount.perUserLimit
                        : 'No Limit'}
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
                                handleUpdateClick(e, discount);
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
                                handleSendEmail(e, discount);
                              }}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              <span>Send Email</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="cursor-pointer"
                              variant="destructive"
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
          </>
        )}
      </div>

      {/* Discount Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <div className="text-sm">
                  {selectedDiscount.discountPercent}%
                </div>

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
            <div className="text-center py-4">
              No discount details available
            </div>
          )}
        </DialogContent>
      </Dialog>

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
