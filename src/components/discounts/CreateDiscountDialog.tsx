import React from 'react';
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
    .min(3, { message: 'Code must be at least 3 characters' })
    .max(20, { message: 'Code must not exceed 20 characters' })
    .refine(value => /^[A-Za-z0-9_]+$/.test(value), {
      message: 'Code can only contain letters, numbers, and underscores'
    }),
  discountPercent: z
    .number()
    .min(0.01, { message: 'Discount must be greater than 0%' })
    .max(100, { message: 'Discount cannot exceed 100%' })
    .refine(value => {
      // Validate to 2 decimal places max as per BigDecimal typical usage
      const stringValue = value.toString();
      const decimalParts = stringValue.split('.');
      return decimalParts.length === 1 || decimalParts[1].length <= 2;
    }, { message: 'Maximum 2 decimal places allowed' }),
  description: z.string().min(5, { message: 'Please enter a description' }),
  type: z.enum(['GENERAL', 'REFERRAL']),
  ownerUserId: z.string().optional(),
  startDate: z.string()
    .min(1, { message: 'Start date is required' })
    .refine(value => {
      // Ensure start date is not in the past
      const startDate = new Date(value);
      const now = new Date();
      return startDate >= now;
    }, { message: 'Start date cannot be in the past' }),
  endDate: z.string()
    .min(1, { message: 'End date is required' }),
  usageLimit: z.number()
    .int({ message: 'Usage limit must be a whole number' })
    .min(1, { message: 'Usage limit must be at least 1' }),
  perUserLimit: z.number()
    .int({ message: 'Per user limit must be a whole number' })
    .min(1, { message: 'Per user limit must be at least 1' }),
};

const formSchema = z.object(schemaShape)
  .superRefine((data, ctx) => {
    // Check if ownerUserId is properly set based on the discount type
    if (data.type === 'REFERRAL') {
      // For REFERRAL type, ownerUserId is required
      if (!data.ownerUserId || data.ownerUserId.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Owner User ID is required for referral discounts',
          path: ['ownerUserId']
        });
      }
    } else {
      // For GENERAL type, ownerUserId must be null or empty
      if (data.ownerUserId && data.ownerUserId.trim().length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Owner user ID must be null for GENERAL discount type',
          path: ['ownerUserId']
        });
      }
    }
  })
  .refine(data => {
    // Validate end date is after start date
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    return endDate > startDate;
  }, {
    message: 'End date must be after start date',
    path: ['endDate']
  })
  .refine(data => {
    // Validate per user limit doesn't exceed usage limit
    return data.perUserLimit <= data.usageLimit;
  }, {
    message: 'Per user limit cannot exceed total usage limit',
    path: ['perUserLimit']
  });

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
      startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      endDate: format(
        new Date(new Date().setMonth(new Date().getMonth() + 1)),
        "yyyy-MM-dd'T'HH:mm:ss"
      ),
      usageLimit: 100,
      perUserLimit: 1,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // For GENERAL type, ensure ownerUserId is null/undefined rather than empty string
      const ownerUserId = data.type === 'GENERAL' ? undefined : data.ownerUserId;
      
      const discountData: CreateDiscountRequest = {
        ...data,
        ownerUserId,
        discountPercent: Number(data.discountPercent),
        usageLimit: Number(data.usageLimit),
        perUserLimit: Number(data.perUserLimit),
      };

      await createDiscount(discountData).unwrap();
      toast.success('Discount created', {
        description: `Discount code ${data.code} was created successfully`,
      });
      form.reset();
      onClose();
    } catch (error) {
      toast.error('Error creating discount', {
        description:
          'There was a problem creating the discount. Please try again.',
      });
      console.error('Error creating discount:', error);
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
        <DialogHeader>
          <DialogTitle>Create New Discount</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new discount code.
          </DialogDescription>
        </DialogHeader>
        <div
          className="overflow-auto"
          style={{ maxHeight: 'calc(100vh - 180px)' }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Code</FormLabel>
                    <FormControl>
                      <Input placeholder="WELCOME10" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a unique code for this discount.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Welcome discount for new users"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*Discount Type and Discount Percentage */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="discountPercent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Percentage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
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
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GENERAL">GENERAL</SelectItem>
                          <SelectItem value="REFERRAL">REFERRAL</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Optional Owner User ID */}
              <FormField
                control={form.control}
                name="ownerUserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch('type') === 'REFERRAL' 
                        ? 'Owner User ID (Required)' 
                        : 'Owner User ID (Leave empty for GENERAL type)'}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={form.watch('type') === 'REFERRAL' ? "user-001" : "Leave empty"} 
                        disabled={form.watch('type') === 'GENERAL'}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {form.watch('type') === 'REFERRAL' 
                        ? 'Enter the user ID who owns this referral discount' 
                        : 'Must be empty for GENERAL discount type'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start Date and End Date */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="usageLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usage Limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="perUserLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Per User Limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
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
