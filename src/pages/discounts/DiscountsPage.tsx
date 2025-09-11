import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
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
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Eye, EyeOff, Loader2, PlusCircle, Trash2 } from 'lucide-react';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch discounts with pagination
  const {
    data: discounts,
    isLoading,
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
  const [deleteDiscount, { isLoading: isDeleting }] = useDeleteDiscountMutation();
  
  // Update discount status mutation
  const [updateDiscountStatus, { isLoading: isUpdating }] = useUpdateDiscountStatusMutation();

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
  const handleDeleteDiscount = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent row click from triggering
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        await deleteDiscount(id).unwrap();
        toast.success('Discount deleted successfully');
      } catch (error) {
        console.error('Failed to delete discount:', error);
        toast.error('Failed to delete discount');
      }
    }
  };
  
  // Handle update discount status
  const handleUpdateClick = async (e: React.MouseEvent, discount: Discount) => {
    e.stopPropagation(); // Prevent row click from triggering
    
    try {
      const newStatus = !discount.isActive;
      const message = newStatus ? 'activate' : 'deactivate';
      
      if (window.confirm(`Are you sure you want to ${message} this discount?`)) {
        await updateDiscountStatus({
          id: discount.id,
          isActive: newStatus,
        }).unwrap();
        toast.success(`Discount ${newStatus ? 'activated' : 'deactivated'} successfully`);
      }
    } catch (error) {
      console.error('Failed to update discount status:', error);
      toast.error('Failed to update discount status');
    }
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
          className="flex items-center gap-2"
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
            className="flex items-center gap-2"
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
              {/* <TableCaption>List of available discounts</TableCaption> */}
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Discount (%)</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discounts?.content.map((discount) => (
                  <TableRow
                    key={discount.id}
                    onClick={() => handleRowClick(discount)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">
                      {discount.code}
                    </TableCell>
                    <TableCell>{discount.type}</TableCell>
                    <TableCell>{discount.discountPercent}%</TableCell>
                    <TableCell>{formatDate(discount.startDate)}</TableCell>
                    <TableCell>{formatDate(discount.endDate)}</TableCell>
                    <TableCell>
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
                      {discount.currentUsageCount} / {discount.usageLimit}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => handleUpdateClick(e, discount)}
                          title={discount.isActive ? "Deactivate discount" : "Activate discount"}
                          className={`h-8 w-8 ${discount.isActive ? 'text-green-600' : 'text-gray-400'}`}
                        >
                          {discount.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {discount.isActive ? "Deactivate" : "Activate"}
                          </span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => handleDeleteDiscount(e, discount.id)} 
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete discount"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
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
                <div className="text-sm">{selectedDiscount.usageLimit}</div>

                <div className="text-sm font-medium">Per User Limit:</div>
                <div className="text-sm">{selectedDiscount.perUserLimit}</div>

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
    </div>
  );
};

export default DiscountsPage;
