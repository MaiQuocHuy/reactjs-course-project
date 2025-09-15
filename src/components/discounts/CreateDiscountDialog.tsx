import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import { useCreateDiscountMutation } from '@/services/discountsApi';
import type { CreateDiscountRequest } from '@/types/discounts';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
// Using Sonner for toast notifications
import { toast } from 'sonner';

// Define the schema shape first for better TypeScript support
const schemaShape = {
  code: z
    .string()
    .min(2, { message: 'Code must be at least 2 characters' })
    .max(50, { message: 'Code must not exceed 50 characters' })
    .refine((value) => /^[A-Z0-9\-_]+$/.test(value), {
      message:
        'Code can only contain uppercase letters, numbers, hyphens, and underscores',
    }),
  discountPercent: z
    .number()
    .min(0.01, { message: 'Discount must be greater than 0.01%' })
    .max(30, { message: 'Discount cannot exceed 30%' })
    .refine(
      (value) => {
        // Check if value has more than 2 decimal places
        return Number(value.toFixed(2)) === value;
      },
      { message: 'Maximum 2 decimal places allowed' }
    ),
  description: z
    .string()
    .min(5, { message: 'Please enter a description' })
    .max(255, { message: 'Description cannot exceed 255 characters' }),
  type: z.enum(['GENERAL', 'REFERRAL']),
  ownerUserId: z.string().optional(),
  startDate: z
    .string()
    .min(1, { message: 'Start date is required' })
    .refine(
      (value) => {
        // Ensure start date is not in the past
        const startDate = new Date(value);
        const now = new Date();
        return startDate >= now;
      },
      { message: 'Start date cannot be in the past' }
    ),
  endDate: z.string().min(1, { message: 'End date is required' }),
  usageLimit: z
    .number()
    .int({ message: 'Usage limit must be a whole number' })
    .min(1, { message: 'Usage limit must be at least 1' })
    .nullable(),
  perUserLimit: z
    .number()
    .int({ message: 'Per user limit must be a whole number' })
    .min(1, { message: 'Per user limit must be at least 1' })
    .nullable(),
};

const formSchema = z
  .object(schemaShape)
  .superRefine((data, ctx) => {
    // Check if ownerUserId is properly set based on the discount type
    if (data.type === 'REFERRAL') {
      // For REFERRAL type, ownerUserId is required
      if (!data.ownerUserId || data.ownerUserId.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Owner User ID is required for referral discounts',
          path: ['ownerUserId'],
        });
      }
    } else {
      // For GENERAL type, ownerUserId must be null or empty
      if (data.ownerUserId && data.ownerUserId.trim().length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Owner user ID must be null for GENERAL discount type',
          path: ['ownerUserId'],
        });
      }
    }
  })
  .refine(
    (data) => {
      // Validate end date is after start date
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate > startDate;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  )
  .refine(
    (data) => {
      // Validate per user limit doesn't exceed usage limit
      // Skip validation if either value is null (no limit)
      if (data.perUserLimit === null || data.usageLimit === null) {
        return true;
      }
      return data.perUserLimit <= data.usageLimit;
    },
    {
      message: 'Per user limit cannot exceed total usage limit',
      path: ['perUserLimit'],
    }
  );

const getCurrentDate = () => {
  const now = new Date();
  return now;
};

const getNextWeekDate = () => {
  const now = getCurrentDate();
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  return nextWeek;
};

interface CreateDiscountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDiscountDialog: React.FC<CreateDiscountDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [createDiscount, { isLoading }] = useCreateDiscountMutation();

  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      discountPercent: 10,
      description: '',
      type: 'GENERAL',
      ownerUserId: '',
      startDate: format(getCurrentDate(), "yyyy-MM-dd'T'HH:mm:ss"),
      endDate: format(getNextWeekDate(), "yyyy-MM-dd'T'HH:mm:ss"),
      usageLimit: 100,
      perUserLimit: 1,
    },
    mode: 'onChange',
  });

  // Define CSS class for valid inputs
  const VALID_INPUT_STYLES = 'border-green-500 focus:border-green-600';

  useEffect(() => {
    // Reset form values when dialog is opened
    if (isOpen) {
      form.reset();
    }
  }, [isOpen]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // For GENERAL type, ownerUserId should be undefined
      // For REFERRAL type, ownerUserId should be provided
      const ownerUserId =
        data.type === 'GENERAL' ? undefined : data.ownerUserId;

      const discountData: CreateDiscountRequest = {
        ...data,
        code: data.code.toUpperCase(), // Ensure code is uppercase
        ownerUserId,
        discountPercent: Number(data.discountPercent),
        usageLimit: data.usageLimit,
        perUserLimit: data.perUserLimit,
      };

      await createDiscount(discountData).unwrap();
      toast.success('Discount created', {
        description: `Discount code ${data.code} was created successfully`,
      });
      form.reset();
      onClose();
    } catch (error: any) {
      console.error('Error creating discount:', error);
      toast.error(error.message || 'Failed to create discount!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        style={{
          width: '65vw',
          maxWidth: '85vw',
          maxHeight: '100vh',
          padding: '15px',
        }}
      >
        <DialogHeader className="px-3">
          <DialogTitle>Create New Discount</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new discount code.
          </DialogDescription>
        </DialogHeader>
        <div
          className="overflow-auto p-3"
          style={{ maxHeight: 'calc(100vh - 180px)' }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Discount Code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => {
                  // Check if this field is valid
                  const fieldError = form.formState.errors.code;
                  const isFieldDirty = form.formState.dirtyFields.code;
                  const isValid = isFieldDirty && !fieldError;

                  return (
                    <FormItem>
                      <FormLabel>Discount Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="WELCOME10"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          className={isValid ? VALID_INPUT_STYLES : ''}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter a unique code (2-50 characters) using only
                        uppercase letters, numbers, hyphens, and underscores.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  // Check if this field is valid
                  const fieldError = form.formState.errors.description;
                  const isFieldDirty = form.formState.dirtyFields.description;
                  const isValid = isFieldDirty && !fieldError;

                  return (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Welcome discount for new users"
                          className={`resize-none ${
                            isValid ? VALID_INPUT_STYLES : ''
                          }`}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Brief description of this discount (max 255 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/*Discount Percentage */}
              <FormField
                control={form.control}
                name="discountPercent"
                render={({ field }) => {
                  // Check if this field is valid
                  const fieldError = form.formState.errors.discountPercent;
                  const isValid = !fieldError;

                  return (
                    <FormItem>
                      <FormLabel>Discount Percentage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0.01}
                          max={30}
                          step={0.01}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className={isValid ? VALID_INPUT_STYLES : ''}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter a discount percentage between 0.01% and 30%
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Discount Type*/}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => {
                  // Check if this field is valid
                  const fieldError = form.formState.errors.type;
                  const isValid = !fieldError;

                  return (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Clear owner user ID when changing to GENERAL type
                          if (value === 'GENERAL') {
                            form.setValue('ownerUserId', '');
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={isValid ? VALID_INPUT_STYLES : ''}
                          >
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GENERAL">GENERAL</SelectItem>
                          <SelectItem value="REFERRAL">REFERRAL</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription
                        className="truncate"
                        title="GENERAL: Available to all users | REFERRAL: Associated with a specific user"
                      >
                        GENERAL: Available to all users | REFERRAL: Associated
                        with a specific user
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Owner User ID - Only shown for REFERRAL type */}
              {form.watch('type') === 'REFERRAL' && (
                <FormField
                  control={form.control}
                  name="ownerUserId"
                  render={({ field }) => {
                    // Check if this field is valid
                    const fieldError = form.formState.errors.ownerUserId;
                    const isFieldDirty = form.formState.dirtyFields.ownerUserId;
                    const isValid = isFieldDirty && !fieldError;

                    return (
                      <FormItem>
                        <FormLabel>Owner User ID (Required)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="user-001"
                            {...field}
                            className={isValid ? VALID_INPUT_STYLES : ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the user ID who owns this referral discount
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}

              {/* Start Date and End Date */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => {
                    // Check if this field is valid
                    const fieldError = form.formState.errors.startDate;
                    const isFieldDirty = form.formState.dirtyFields.startDate;
                    const isValid = isFieldDirty && !fieldError;

                    return (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            className={isValid ? VALID_INPUT_STYLES : ''}
                          />
                        </FormControl>
                        <FormDescription>
                          When this discount becomes valid (must be in the
                          future)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => {
                    // Check if this field is valid
                    const fieldError = form.formState.errors.endDate;
                    const isFieldDirty = form.formState.dirtyFields.endDate;
                    const isValid = isFieldDirty && !fieldError;

                    return (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            className={isValid ? VALID_INPUT_STYLES : ''}
                          />
                        </FormControl>
                        <FormDescription>
                          When this discount expires (must be after start date)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="usageLimit"
                  render={({ field }) => {
                    // Check if this field is valid
                    const fieldError = form.formState.errors.usageLimit;
                    const isValid = !fieldError;

                    return (
                      <FormItem>
                        <FormLabel>Total Usage Limit</FormLabel>
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              disabled={field.value === null}
                              value={field.value === null ? '' : field.value}
                              onChange={(e) => {
                                const val =
                                  e.target.value === ''
                                    ? ''
                                    : Number(e.target.value);
                                field.onChange(val === '' ? null : val);
                              }}
                              className={isValid ? VALID_INPUT_STYLES : ''}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className="whitespace-nowrap cursor-pointer"
                            onClick={() =>
                              field.onChange(field.value === null ? 100 : null)
                            }
                          >
                            {field.value === null ? 'Set Limit' : 'No Limit'}
                          </Button>
                        </div>
                        <FormDescription
                          className="truncate"
                          title="Maximum number of times this discount can be used (or No Limit)"
                        >
                          Maximum number of times this discount can be used (or
                          No Limit)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="perUserLimit"
                  render={({ field }) => {
                    // Check if this field is valid
                    const fieldError = form.formState.errors.perUserLimit;
                    const isValid = !fieldError;

                    return (
                      <FormItem>
                        <FormLabel>Per User Limit</FormLabel>
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              disabled={field.value === null}
                              value={field.value === null ? '' : field.value}
                              onChange={(e) => {
                                const val =
                                  e.target.value === ''
                                    ? ''
                                    : Number(e.target.value);
                                field.onChange(val === '' ? null : val);
                              }}
                              className={isValid ? VALID_INPUT_STYLES : ''}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className="whitespace-nowrap cursor-pointer"
                            onClick={() =>
                              field.onChange(field.value === null ? 1 : null)
                            }
                          >
                            {field.value === null ? 'Set Limit' : 'No Limit'}
                          </Button>
                        </div>
                        <FormDescription
                          className="truncate"
                          title="Maximum number of times a single user can use this discount (or No Limit)"
                        >
                          Maximum number of times a single user can use this
                          discount (or No Limit)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Discount'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDiscountDialog;
