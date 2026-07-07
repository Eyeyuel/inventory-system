'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SALES_ORDER_STATUS } from './sales-table';
import { useEffect } from 'react';
import { Trash } from 'lucide-react';

export const salesFilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  customer: z.string().optional(),

  orderDateFrom: z.string().optional(),
  orderDateTo: z.string().optional(),

  requestedDeliveryFrom: z.string().optional(),
  requestedDeliveryTo: z.string().optional(),

  minTotalAmount: z.number().optional(),
  maxTotalAmount: z.number().optional(),

  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
});

export type SalesFilterFormValues = z.infer<typeof salesFilterSchema>;

interface SalesFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: SalesFilterFormValues; // current filter state from the table
  onFilter: (values: SalesFilterFormValues) => void; // callback on submit
}

export function SalesFilterDialog({
  open,
  onOpenChange,
  filters,
  onFilter,
}: SalesFilterDialogProps) {
  const form = useForm<SalesFilterFormValues>({
    resolver: zodResolver(salesFilterSchema),
    defaultValues: {
      search: filters.search ?? '',
      status: filters.status ?? '',
      customer: filters.customer ?? '',
      orderDateFrom: filters.orderDateFrom ?? '',
      orderDateTo: filters.orderDateTo ?? '',
      requestedDeliveryFrom: filters.requestedDeliveryFrom ?? '',
      requestedDeliveryTo: filters.requestedDeliveryTo ?? '',
      minTotalAmount: filters.minTotalAmount,
      maxTotalAmount: filters.maxTotalAmount,
      sortBy: filters.sortBy ?? '',
      sortOrder: filters.sortOrder,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(filters); // reset to current filter values
    }
  }, [open, filters, form]);

  const onSubmit = (values: SalesFilterFormValues) => {
    console.log('Submitting filter values:', values);
    onFilter(values);
    onOpenChange(false);
  };

  const onClearFilters = () => {
    const emptyFilters = {
      search: '',
      status: '',
      customer: '',
      orderDateFrom: '',
      orderDateTo: '',
      requestedDeliveryFrom: '',
      requestedDeliveryTo: '',
      minTotalAmount: undefined,
      maxTotalAmount: undefined,
      sortBy: '',
      sortOrder: undefined,
    };

    form.reset(emptyFilters);
    onFilter(emptyFilters);
    onOpenChange(false);
  };

  // useEffect(() => {
  //   console.log('Form validation errors:', form.formState.errors);
  // }, [form.formState.errors]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Advanced Filtering</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Sales Order Filters</DialogTitle>
          <DialogDescription className="sr-only">
            Filter sales orders by status, customer, date, and amount.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Search */}
          {/* <div className="space-y-2">
            <Label>Search</Label>
            <Input placeholder="Order number or customer" {...form.register('search')} />
          </div> */}

          {/* status */}
          <div className="space-y-2 flex justify-between">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                onValueChange={(value) => form.setValue('status', value === 'all' ? '' : value)}
                value={form.watch('status') ?? 'all'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {Object.values(SALES_ORDER_STATUS).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              {' '}
              <Button type="button" variant="outline" onClick={() => onClearFilters()}>
                <Trash /> Clear Filters
              </Button>
            </div>
          </div>

          {/* Customer */}
          <div className="space-y-2">
            <Label>Customer</Label>
            <Input placeholder="Customer name" {...form.register('customer')} />
          </div>

          {/* Order Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Order Date From</Label>
              <Input type="date" {...form.register('orderDateFrom')} />
            </div>

            <div className="space-y-2">
              <Label>Order Date To</Label>
              <Input type="date" {...form.register('orderDateTo')} />
            </div>
          </div>

          {/* Requested Delivery */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Requested Delivery From</Label>
              <Input type="date" {...form.register('requestedDeliveryFrom')} />
            </div>

            <div className="space-y-2">
              <Label>Requested Delivery To</Label>
              <Input type="date" {...form.register('requestedDeliveryTo')} />
            </div>
          </div>

          {/* Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Amount</Label>
              <Input
                type="number"
                {...form.register('minTotalAmount', {
                  setValueAs: (v) => (v === '' ? undefined : Number(v)),
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Max Amount</Label>
              <Input
                type="number"
                {...form.register('maxTotalAmount', {
                  setValueAs: (v) => (v === '' ? undefined : Number(v)),
                })}
              />
            </div>
          </div>
          {Object.keys(form.formState.errors).length > 0 && (
            <div className="text-red-500 text-sm">Please fix the highlighted fields.</div>
          )}

          <Button type="submit" className="w-full">
            Apply Filters
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
