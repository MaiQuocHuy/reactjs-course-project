import React, { useState } from 'react';
import { ArrowUpDown, Loader2, PlusCircle, X } from 'lucide-react';

import { Pagination } from '@/components/shared/Pagination';
import {
  useGetAllDiscountsQuery,
  useGetDiscountByIdQuery,
  useGetDiscountsByTypeQuery,
  useGetDiscountByCodeQuery,
  useGetDiscountsByOwnerUserIdQuery,
  useSendEmailMutation,
} from '@/services/discountsApi';
import { useGetUsersQuery } from '@/services/usersApi';
import { useDebounce } from '@/hooks/useDebounce';
import type { Discount, SendDiscountEmailRequest } from '@/types/discounts';
import type { User } from '@/types/users';
import { Button } from '@/components/ui/button';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateDiscountDialog from '@/components/discounts/CreateDiscountDialog';
import { toast } from 'sonner';
import DiscountTable from '@/components/discounts/DiscountTable';
import DiscountDetails from '@/components/discounts/DiscountDetails';
import EmailSubject from '@/components/discounts/SendEmailDialog/EmailSubject';
import AdvanceSearchBar from '@/components/discounts/SendEmailDialog/AdvanceSearchBar';
import SelectedUsersList from '@/components/discounts/SendEmailDialog/SelectedUsersList';
import DiscountTableSkeleton from '@/components/discounts/DiscountTableSkeleton';
import DiscountPageSkeleton from '../../components/discounts/DiscountPageSkeleton';

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

  // Email tabs and user selection states
  const [emailTab, setEmailTab] = useState<'all' | 'specific'>('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [specificUsersError, setSpecificUsersError] = useState('');

  // Filter states
  const [filterType, setFilterType] = useState<'ALL' | 'GENERAL' | 'REFERRAL'>(
    'ALL'
  );
  const [filterCode, setFilterCode] = useState('');
  const [filterOwnerUserId, setFilterOwnerUserId] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'type' | 'code' | 'owner'
  >('all');

  // Debounced search for user selection
  const debouncedSearchQuery = useDebounce(userSearchQuery, 300);

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
  const error = errorAll || errorType;

  // Fetch selected discount details
  const { data: selectedDiscount, isLoading: isLoadingDetails } =
    useGetDiscountByIdQuery(selectedDiscountId || '', {
      skip: !selectedDiscountId,
    });

  // Fetch users for search (only when searching for specific users)
  const { data: searchUsersData, isLoading: isLoadingUsers } = useGetUsersQuery(
    {
      search: debouncedSearchQuery,
      role: 'STUDENT',
      isActive: true,
      page: 0,
      size: 10,
    },
    {
      skip: !debouncedSearchQuery.trim(),
    }
  );

  // Send email mutation
  const [sendEmail, { isLoading: isSendingEmail }] = useSendEmailMutation();

  // Helper functions for user selection
  const addUserToSelection = (user: User) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers((prev) => [...prev, user]);
      setSpecificUsersError('');
    }
  };

  const removeUserFromSelection = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const clearSelectedUsers = () => {
    setSelectedUsers([]);
    setSpecificUsersError('');
  };

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

    // If type is GENERAL, clear owner user ID
    if (type === 'GENERAL' || type === 'ALL') {
      setFilterOwnerUserId('');
    }

    if (type === 'ALL') {
      setActiveFilter('all');
    } else {
      setActiveFilter('type');
    }
    setPage(0);
  };

  // const handleFilterByCode = (code: string) => {
  //   setFilterCode(code);
  //   if (code.trim()) {
  //     setActiveFilter('code');
  //     if (filterType !== 'ALL') {
  //       setFilterType('ALL');
  //     }
  //   } else {
  //     setActiveFilter('all');
  //   }
  //   setPage(0);
  // };

  // const handleFilterByOwnerUserId = (ownerUserId: string) => {
  //   setFilterOwnerUserId(ownerUserId);

  //   // If owner user ID is provided, set type to REFERRAL
  //   if (ownerUserId.trim()) {
  //     if (filterType !== 'REFERRAL') {
  //       setFilterType('REFERRAL');
  //     }
  //     setActiveFilter('owner');
  //   } else {
  //     setActiveFilter('all');
  //     setFilterType('ALL');
  //   }
  //   setPage(0);
  // };

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
    setEmailTab('all');
    clearSelectedUsers();
    setUserSearchQuery('');
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

    // Validate specific users selection if specific tab is active
    if (emailTab === 'specific') {
      if (selectedUsers.length === 0) {
        setSpecificUsersError(
          'Please select at least one student to send the email to.'
        );
        return;
      }
    }

    try {
      const emailData: SendDiscountEmailRequest = {
        subject: emailSubject,
        discount_id: selectedDiscountForEmail.id,
      };

      if (emailTab === 'specific') {
        const user_ids = selectedUsers.map((user) => user.id);
        // Convert to string if only one user is selected
        if (user_ids.length === 1) {
          emailData.user_ids = user_ids[0];
        } else {
          emailData.user_ids = user_ids;
        }
      }

      sendEmail(emailData).unwrap();

      toast.success(
        `Discount email sent successfully to ${
          emailTab === 'all'
            ? 'all students'
            : `${selectedUsers.length} selected students`
        }`
      );
      setIsEmailDialogOpen(false);
      setEmailSubject('');
      setSelectedDiscountForEmail(null);
      clearSelectedUsers();
      setUserSearchQuery('');
    } catch (error) {
      console.error('Failed to send discount email:', error);
      toast.error('Failed to send discount email');
    }
  };

  // Handle cancel send email
  const handleCancelSendEmail = () => {
    setIsEmailDialogOpen(false);
    setEmailSubject('');
    setSelectedDiscountForEmail(null);
    clearSelectedUsers();
    setUserSearchQuery('');
  };

  if (isLoadingAll) {
    return (
     <DiscountPageSkeleton />
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
        {/* Filters */}
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Available Discounts</h2>

          <div className="flex items-center gap-4">
            {/* Filter by Type */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Type:</label>
              <Select
                value={filterType}
                onValueChange={handleFilterByType}
                disabled={
                  filterCode.trim() !== '' || filterOwnerUserId.trim() !== ''
                }
              >
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
            {/* <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Code:</label>
              <Input
                placeholder="Enter discount code"
                value={filterCode.toUpperCase()}
                onChange={(e) => handleFilterByCode(e.target.value)}
                className={`w-40`}
                disabled={filterOwnerUserId.trim() !== ''}
              />
            </div> */}

            {/* Filter by Owner User Id */}
            {/* <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Owner ID:</label>
              <Input
                placeholder="Enter owner user ID"
                value={filterOwnerUserId}
                onChange={(e) => handleFilterByOwnerUserId(e.target.value)}
                className="w-40"
                disabled={filterCode.trim() !== ''}
              />
            </div> */}

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
                className="flex items-center gap-2 cursor-pointer"
              >
                <X size={16} />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Discount Table */}
        {isLoadingType || isLoadingCode || isLoadingOwner ? (
          <DiscountTableSkeleton />
        ) : (
          <>
            {errorCode || errorOwner ? (
              <div className="p-8 text-center">
                <div className="text-gray-500 text-lg font-medium mb-2">
                  No Discounts Found
                </div>
                <div className="text-gray-400 text-sm">
                  Please modify the filters to find relevant discounts
                </div>
              </div>
            ) : (
              <div>
                <DiscountTable
                  discounts={discounts?.content}
                  onRowClick={handleRowClick}
                  onSendEmail={handleSendEmail}
                  page={page}
                  itemsPerPage={pageSize}
                />

                {/* Pagination component */}
                {discounts &&
                  discounts.page &&
                  discounts.page.totalPages >= 1 && (
                    <Pagination
                      currentPage={page}
                      itemsPerPage={pageSize}
                      pageInfo={discounts.page}
                      onPageChange={handlePageChange}
                      onItemsPerPageChange={handlePageSizeChange}
                    />
                  )}
              </div>
            )}
          </>
        )}
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

      {/* Send Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Discount Email</DialogTitle>
            <DialogDescription>
              Send an email notification for the discount{' '}
              <strong>{selectedDiscountForEmail?.code}</strong>.
              <br />
              <span className="text-amber-600 font-medium mt-2 block">
                ⚠️ Please double-check before sending the email.
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Email Subject */}
            <EmailSubject
              emailSubject={emailSubject}
              setEmailSubject={setEmailSubject}
            />

            {/* Recipient Selection Tabs */}
            <div className="space-y-4">
              <Label>Select Recipients</Label>
              <Tabs
                value={emailTab}
                onValueChange={(value) =>
                  setEmailTab(value as 'all' | 'specific')
                }
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">Send to All Students</TabsTrigger>
                  <TabsTrigger value="specific">
                    Send to Specific Users
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      The email will be sent to all active students in the
                      system.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="specific" className="mt-4 space-y-4">
                  {/* User Search */}
                  <AdvanceSearchBar
                    userSearchQuery={userSearchQuery}
                    setUserSearchQuery={setUserSearchQuery}
                    isLoadingUsers={isLoadingUsers}
                    searchUsersData={searchUsersData?.data?.users}
                    selectedUsers={selectedUsers}
                    addUserToSelection={addUserToSelection}
                  />

                  {/* Selected Users List */}
                  <SelectedUsersList
                    selectedUsers={selectedUsers}
                    clearSelectedUsers={clearSelectedUsers}
                    specificUsersError={specificUsersError}
                    onRemoveUser={removeUserFromSelection}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={handleCancelSendEmail}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleSendEmailConfirm}
              disabled={
                emailSubject.length < 5 ||
                emailSubject.length > 200 ||
                isSendingEmail ||
                (emailTab === 'specific' && selectedUsers.length === 0)
              }
            >
              {isSendingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                `Send Email${
                  emailTab === 'specific'
                    ? ` to ${selectedUsers.length} Students`
                    : ' to All Students'
                }`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiscountsPage;
