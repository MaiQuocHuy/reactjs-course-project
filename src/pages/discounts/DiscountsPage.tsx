import React, { useState } from 'react';

import { Pagination } from '@/components/shared/Pagination';
import {
  useGetAllDiscountsQuery,
  useGetDiscountByIdQuery,
  useGetDiscountsByTypeQuery,
  useGetDiscountByCodeQuery,
  useGetDiscountsByOwnerUserIdQuery,
  useDeleteDiscountMutation,
  useUpdateDiscountStatusMutation,
  useSendEmailMutation,
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ArrowUpDown, Loader2, PlusCircle, X } from 'lucide-react';
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

  // Email dialog states
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [selectedDiscountForEmail, setSelectedDiscountForEmail] =
    useState<Discount | null>(null);

  // Filter states
  const [filterType, setFilterType] = useState<'ALL' | 'GENERAL' | 'REFERRAL'>(
    'ALL'
  );
  const [filterCode, setFilterCode] = useState('');
  const [filterOwnerUserId, setFilterOwnerUserId] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'type' | 'code' | 'owner'
  >('all');

  // Alert dialog states
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [alertDialogProps, setAlertDialogProps] = useState({
    title: '',
    description: '',
    action: () => {},
  });

  // Fetch discounts with pagination based on active filter
  const {
    data: allDiscounts,
    isLoading: isLoadingAll,
    error: errorAll,
  } = useGetAllDiscountsQuery(
    {
      page,
      size: pageSize,
      sortBy: 'createdAt',
      sortDir,
    },
    {
      skip: activeFilter !== 'all',
    }
  );

  const {
    data: typeDiscounts,
    isLoading: isLoadingType,
    error: errorType,
  } = useGetDiscountsByTypeQuery(
    {
      type: filterType as 'GENERAL' | 'REFERRAL',
      page,
      size: pageSize,
      sortBy: 'createdAt',
      sortDir,
    },
    {
      skip: activeFilter !== 'type' || filterType === 'ALL',
    }
  );

  const {
    data: codeDiscount,
    isLoading: isLoadingCode,
    error: errorCode,
  } = useGetDiscountByCodeQuery(filterCode, {
    skip: activeFilter !== 'code' || !filterCode.trim(),
  });

  const {
    data: ownerDiscounts,
    isLoading: isLoadingOwner,
    error: errorOwner,
  } = useGetDiscountsByOwnerUserIdQuery(
    {
      ownerUserId: filterOwnerUserId,
      type: 'REFERRAL',
      page,
      size: pageSize,
      sortBy: 'createdAt',
      sortDir,
    },
    {
      skip: activeFilter !== 'owner' || !filterOwnerUserId.trim(),
    }
  );

  // Combine data based on active filter
  const discounts =
    activeFilter === 'all'
      ? allDiscounts
      : activeFilter === 'type'
      ? typeDiscounts
      : activeFilter === 'code'
      ? codeDiscount
        ? {
            content: [codeDiscount],
            page: {
              number: 0,
              size: 1,
              totalElements: 1,
              totalPages: 1,
              first: true,
              last: true,
            },
          }
        : null
      : activeFilter === 'owner'
      ? ownerDiscounts
      : null;

  const isLoadingDiscounts =
    isLoadingAll || isLoadingType || isLoadingCode || isLoadingOwner;
  const error = errorAll || errorType || errorCode || errorOwner;

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

  // Send email mutation
  const [sendEmail, { isLoading: isSendingEmail }] = useSendEmailMutation();

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

  // Filter handlers
  const handleFilterByType = (type: 'ALL' | 'GENERAL' | 'REFERRAL') => {
    setFilterType(type);
    if (type === 'ALL') {
      setActiveFilter('all');
    } else {
      setActiveFilter('type');
    }
    setPage(0);
  };

  const handleFilterByCode = (code: string) => {
    setFilterCode(code);
    if (code.trim()) {
      setActiveFilter('code');
    } else {
      setActiveFilter('all');
    }
    setPage(0);
  };

  const handleFilterByOwnerUserId = (ownerUserId: string) => {
    setFilterOwnerUserId(ownerUserId);
    if (ownerUserId.trim()) {
      setActiveFilter('owner');
    } else {
      setActiveFilter('all');
    }
    setPage(0);
  };

  const clearFilters = () => {
    setFilterType('ALL');
    setFilterCode('');
    setFilterOwnerUserId('');
    setActiveFilter('all');
    setPage(0);
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

    // Check if discount type is GENERAL
    if (discount.type !== 'GENERAL') {
      toast.error('Email can only be sent for GENERAL type discounts');
      return;
    }

    // Set the selected discount and open the email dialog
    setSelectedDiscountForEmail(discount);
    setEmailSubject('');
    setIsEmailDialogOpen(true);
  };

  // Handle sending the email
  const handleSendEmailConfirm = () => {
    if (!selectedDiscountForEmail) return;

    // Validate subject length
    if (emailSubject.length < 5 || emailSubject.length > 200) {
      toast.error('Subject must be between 5 and 200 characters');
      return;
    }

    try {
      sendEmail({
        subject: emailSubject,
        discount_id: selectedDiscountForEmail.id,
      }).unwrap();

      toast.success('Discount email sent successfully');
      setIsEmailDialogOpen(false);
      setEmailSubject('');
      setSelectedDiscountForEmail(null);
    } catch (error) {
      console.error('Failed to send discount email:', error);
      toast.error('Failed to send discount email');
    }
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
          disabled={isLoadingDiscounts}
        >
          <PlusCircle size={16} />
          <span>Create Discount</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Available Discounts</h2>

          <div className="flex items-center gap-4">
            {/* Filter by Type */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Type:</label>
              <Select value={filterType} onValueChange={handleFilterByType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="REFERRAL">Referral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter by Discount Code */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Code:</label>
              <Input
                placeholder="Enter discount code"
                value={filterCode}
                onChange={(e) => handleFilterByCode(e.target.value)}
                className="w-40"
              />
            </div>

            {/* Filter by Owner User Id */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Owner ID:</label>
              <Input
                placeholder="Enter owner user ID"
                value={filterOwnerUserId}
                onChange={(e) => handleFilterByOwnerUserId(e.target.value)}
                className="w-40"
              />
            </div>

            {/* Filter by Date */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSortDirection}
              className="flex items-center gap-2 cursor-pointer"
              disabled={isLoadingDiscounts}
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

            {/* Clear Filters Button */}
            {activeFilter !== 'all' && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Clear
              </Button>
            )}
          </div>
        </div>{' '}
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

      {/* Send Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Discount Email</DialogTitle>
            <DialogDescription>
              Send an email notification for the referral discount{' '}
              <strong>{selectedDiscountForEmail?.code}</strong>.
              <br />
              <span className="text-amber-600 font-medium mt-2 block">
                ⚠️ Please double-check before sending the email.
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-subject">Email Subject</Label>
              <Textarea
                id="email-subject"
                placeholder="Enter email subject (5-200 characters)"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className={
                  emailSubject.length > 0 &&
                  (emailSubject.length < 5 || emailSubject.length > 200)
                    ? 'border-red-500'
                    : ''
                }
                rows={3}
              />
              <div className="text-sm text-muted-foreground">
                {emailSubject.length}/200 characters
                {emailSubject.length > 0 && emailSubject.length < 5 && (
                  <span className="text-red-500 ml-2">
                    Minimum 5 characters required
                  </span>
                )}
                {emailSubject.length > 200 && (
                  <span className="text-red-500 ml-2">
                    Maximum 200 characters exceeded
                  </span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setIsEmailDialogOpen(false);
                setEmailSubject('');
                setSelectedDiscountForEmail(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmailConfirm}
              disabled={
                emailSubject.length < 5 ||
                emailSubject.length > 200 ||
                isSendingEmail
              }
            >
              {isSendingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Email'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiscountsPage;
