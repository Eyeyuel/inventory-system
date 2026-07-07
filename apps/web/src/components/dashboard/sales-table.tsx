'use client';

import { getSalesOrderById, getSalesOrders } from '@/services/client/sales';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Field, FieldLabel } from '../ui/field';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { SalesFilterDialog, SalesFilterFormValues } from './sales-filter-dialog';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';

// ----- Sales Order Statuses -----
export const SALES_ORDER_STATUS = {
  DRAFT: 'draft',
  CONFIRMED: 'confirmed',
  ALLOCATED: 'allocated',
  PARTIALLY_SHIPPED: 'partially_shipped',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

// Derive the TypeScript type from the object values (union of string literals)
export type SalesOrderStatus = (typeof SALES_ORDER_STATUS)[keyof typeof SALES_ORDER_STATUS];

// ----- Sortable Sales Order Fields -----
export const SORTABLE_SALES_FIELDS = {
  ORDER_NUMBER: 'orderNumber',
  STATUS: 'status',
  TOTAL_AMOUNT: 'totalAmount',
  ORDER_DATE: 'orderDate',
  REQUESTED_DELIVERY_DATE: 'requestedDeliveryDate',
  SHIPPED_DATE: 'shippedDate',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export type SalesFilters = {
  page: number;
  limit: number;
  search: string | undefined;
  status: SalesOrderStatus | undefined;
  customer: string | undefined;
  orderDateFrom: string | undefined;
  orderDateTo: string | undefined;
  requestedDeliveryFrom: string | undefined;
  requestedDeliveryTo: string | undefined;
  minTotalAmount: number | undefined;
  maxTotalAmount: number | undefined;
  sortBy: string | undefined;
  sortOrder: 'ASC' | 'DESC' | undefined;
};

export type SortableField = (typeof SORTABLE_SALES_FIELDS)[keyof typeof SORTABLE_SALES_FIELDS];

const SalesTable = () => {
  // 1. Unified filters state – the single source of truth
  const [filters, setFilters] = useState<SalesFilters>({
    page: 1,
    limit: 10,
    search: undefined,
    status: undefined, // now from the plain constant
    customer: undefined,
    sortBy: SORTABLE_SALES_FIELDS.CREATED_AT,
    sortOrder: 'DESC' as 'ASC' | 'DESC',
    orderDateFrom: undefined,
    orderDateTo: undefined,
    requestedDeliveryFrom: undefined,
    requestedDeliveryTo: undefined,
    minTotalAmount: undefined,
    maxTotalAmount: undefined,
  });

  // 2. React Query depends on the entire filters object
  const { data, isLoading } = useQuery({
    queryKey: ['sales-orders', filters],
    // queryFn: () => getSalesOrders(filters), // pass the whole filters object
    queryFn: () => getSalesOrders(filters), // pass the whole filters object
    placeholderData: (previousData) => previousData, // 👈 keep old data
  });

  // fetching single order details
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const {
    data: orderDetails,
    isLoading: isOrderLoading,
    isFetching: isOrderFetching,
  } = useQuery({
    queryKey: ['sales-order', selectedOrderId],
    queryFn: () => getSalesOrderById(selectedOrderId!),
    enabled: !!selectedOrderId,
    placeholderData: (previousData) => previousData, // 👈 keep old data
  });

  const handleSort = (field: SortableField) => {
    // 👈 changed from string
    setFilters((prev) => {
      const isSame = prev.sortBy === field;
      return {
        ...prev,
        sortBy: field, // now correctly typed
        sortOrder: isSame ? (prev.sortOrder === 'ASC' ? 'DESC' : 'ASC') : 'ASC',
        page: 1,
      };
    });
  };

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const handleFilter = (formValues: SalesFilterFormValues) => {
    console.log(formValues);
    setFilters((prev) => ({
      ...prev,
      search: formValues.search || undefined,
      status: (formValues.status as SalesOrderStatus) || undefined,
      customer: formValues.customer || undefined,
      orderDateFrom: formValues.orderDateFrom || undefined,
      orderDateTo: formValues.orderDateTo || undefined,
      requestedDeliveryFrom: formValues.requestedDeliveryFrom || undefined,
      requestedDeliveryTo: formValues.requestedDeliveryTo || undefined,
      minTotalAmount: formValues.minTotalAmount ? Number(formValues.minTotalAmount) : undefined,
      maxTotalAmount: formValues.maxTotalAmount ? Number(formValues.maxTotalAmount) : undefined,
      sortBy: formValues.sortBy || undefined,
      sortOrder: formValues.sortOrder || undefined,
    }));
  };

  return (
    <div>
      {/* 4. Search input – resets page to 1 on change */}

      {isLoading && <p>Loading...</p>}

      <div>
        <div className="flex items-center justify-between">
          <Input
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
                page: 1,
              }))
            }
            placeholder="Search..."
            className="max-w-sm" // or w-64, w-72, depending on your design
          />
          <SalesFilterDialog
            open={filterDialogOpen}
            onOpenChange={setFilterDialogOpen}
            filters={filters} // cast to match the form shape (or build a compatible object)
            onFilter={handleFilter}
          />
        </div>

        <div className="min-h-105">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>
                  <Select
                    value={filters.status ?? 'all'}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        status: value === 'all' ? undefined : (value as SalesOrderStatus),
                        page: 1,
                      }))
                    }
                  >
                    <SelectTrigger className="w-auto min-w-27.5 border-0 shadow-none hover:bg-accent gap-1 px-2 py-1 h-auto">
                      <SelectValue placeholder="Status" />
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
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-accent"
                  onClick={() => handleSort(SORTABLE_SALES_FIELDS.ORDER_DATE)}
                >
                  <div className="flex items-center gap-1">
                    Order Date
                    {filters.sortBy === SORTABLE_SALES_FIELDS.ORDER_DATE && isOrderFetching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : filters.sortBy === SORTABLE_SALES_FIELDS.ORDER_DATE ? (
                      filters.sortOrder === 'ASC' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Items</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.data.map((order) => (
                <Sheet key={order.id}>
                  <SheetTrigger asChild>
                    <TableRow
                      className="cursor-pointer"
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>${Number(order.totalAmount).toLocaleString()}</TableCell>
                    </TableRow>
                  </SheetTrigger>

                  {/* Order detail sheet – unchanged */}
                  <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-2">
                    <SheetHeader>
                      <SheetTitle className="text-2xl font-bold">
                        {orderDetails?.orderNumber}
                      </SheetTitle>
                      <SheetDescription>View sales order details and items</SheetDescription>
                    </SheetHeader>

                    {isOrderLoading ? (
                      <div className="py-10 text-center">Loading...</div>
                    ) : (
                      <div className="mt-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-xl border p-4">
                            <p className="text-sm text-muted-foreground">Customer</p>
                            <p className="font-semibold">{orderDetails?.customerId}</p>
                          </div>
                          <div className="rounded-xl border p-4">
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge className="mt-2" variant="outline">
                              {orderDetails?.status}
                            </Badge>
                          </div>
                          <div className="rounded-xl border p-4">
                            <p className="text-sm text-muted-foreground">Order Date</p>
                            <p className="font-semibold">
                              {orderDetails?.orderDate
                                ? new Date(orderDetails.orderDate).toLocaleDateString()
                                : 'N/A'}
                            </p>
                          </div>
                          <div className="rounded-xl border p-4">
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                            <p className="font-semibold text-lg">
                              ${Number(orderDetails?.totalAmount).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-4 text-lg font-semibold">Order Items</h3>
                          <div className="space-y-3">
                            {orderDetails?.items?.map((item: any) => (
                              <div
                                key={item.id}
                                className="rounded-xl border p-4 hover:bg-muted/40 transition"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">Product: {item.product}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Location: {item.location}
                                    </p>
                                  </div>
                                  <Badge variant="secondary">Qty: {item.quantityOrdered}</Badge>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Unit Price</p>
                                    <p className="font-medium">
                                      ${Number(item.unitPrice).toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Quantity Shipped</p>
                                    <p className="font-medium">{item.quantityShipped}</p>
                                  </div>
                                </div>
                                {item.description && (
                                  <div className="mt-4">
                                    <p className="text-muted-foreground text-sm">Description</p>
                                    <p>{item.description}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-xl border p-4 text-sm text-muted-foreground">
                          <p>
                            Created At:{' '}
                            {orderDetails?.createdAt
                              ? new Date(orderDetails.createdAt).toLocaleString()
                              : 'N/A'}
                          </p>
                          <p className="mt-2">
                            Updated At:{' '}
                            {orderDetails?.updatedAt
                              ? new Date(orderDetails.updatedAt).toLocaleString()
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    )}
                  </SheetContent>
                </Sheet>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls – unified filter updates */}
        <div className="flex items-center justify-between border-t p-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <Field orientation="horizontal" className="w-fit">
              <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
              <Select
                value={String(filters.limit)}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    limit: Number(value),
                    page: 1,
                  }))
                }
              >
                <SelectTrigger className="w-20" id="select-rows-per-page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: Math.max(prev.page - 1, 1),
                      }))
                    }
                    className={filters.page === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>

                <PaginationItem>
                  <span className="text-sm px-2">
                    Page {filters.page} of {data?.totalPages ?? 1}
                  </span>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: data?.totalPages
                          ? Math.min(prev.page + 1, data.totalPages)
                          : prev.page,
                      }))
                    }
                    className={
                      data?.totalPages && filters.page >= data.totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <p>Total Orders: {data?.total}</p>
        </div>
      </div>
    </div>
  );
};

export default SalesTable;
