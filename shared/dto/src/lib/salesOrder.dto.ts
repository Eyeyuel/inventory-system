import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateSalesOrderItemDto, SalesOrderItemResponseDto } from './salesOrderItem.dto';
import { Type } from 'class-transformer';
import { SalesOrderStatusType } from '@inventory-system/types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSalesOrderDto {
  @ApiProperty({ example: 'Acme Supplies', description: 'Name of the supplier', nullable: false })
  @IsString()
  customer!: string; // or just customer string if no entity

  // @IsString()
  // @IsOptional()
  // orderNumber?: string;

  @ApiProperty({ example: '2023-12-31', description: 'Expected order date', nullable: true })
  @IsDateString()
  @IsOptional()
  orderDate?: string; // defaults to today if not provided

  @ApiProperty({ example: '2024-01-15', description: 'Requested delivery date', nullable: true })
  @IsDateString()
  @IsOptional()
  requestedDeliveryDate?: string;

  @ApiProperty({
    type: [CreateSalesOrderItemDto],
    description: 'List of items in the sales order',
    examples: [
      {
        productId: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e',
        locationId: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e',
        quantityOrdered: 10,
        unitPrice: 100,
      },
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateSalesOrderItemDto)
  items!: CreateSalesOrderItemDto[];
}

export class SalesOrderResponseDto {
  @ApiProperty({
    example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e',
    description: 'Unique identifier for the sales order',
  })
  id!: string;
  @ApiProperty({ example: 'SO-001', description: 'Sales order number' })
  orderNumber!: string;
  @ApiProperty({ example: 'Acme Supplies', description: 'Name of the customer' })
  status!: SalesOrderStatusType;
  @ApiProperty({ example: '2023-12-31', description: 'Expected order date', nullable: true })
  orderDate?: Date | null;
  @ApiProperty({ example: '2024-01-15', description: 'Requested delivery date', nullable: true })
  requestedDeliveryDate?: Date | null;
  @ApiProperty({ example: '2024-01-20', description: 'Actual shipped date', nullable: true })
  shippedDate?: Date | null;
  @ApiProperty({ example: 1000, description: 'Total cost of the sales order' })
  totalAmount!: number;
  @ApiProperty({
    example: '27b5030c-71d6-45e5-b9d8-d0cd79bfaca0',
    description: 'User ID that owns the sales order',
    format: 'uuid',
  })
  userId!: string;
  @ApiProperty({
    example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e',
    description: 'Unique identifier for the customer',
    format: 'uuid',
  })
  customerId!: string;
  @ApiProperty({
    type: [SalesOrderItemResponseDto],
    description: 'List of items in the sales order',
  })
  items!: SalesOrderItemResponseDto[];
  @ApiProperty({
    example: '2023-12-31T00:00:00.000Z',
    description: 'Timestamp when the sales order was created',
  })
  createdAt!: Date;
  @ApiProperty({
    example: '2023-12-31T00:00:00.000Z',
    description: 'Timestamp when the sales order was last updated',
  })
  updatedAt!: Date;
}

export enum SortableSalesOrderFields {
  ORDER_NUMBER = 'orderNumber',
  STATUS = 'status',
  TOTAL_AMOUNT = 'totalAmount',
  ORDER_DATE = 'orderDate',
  REQUESTED_DELIVERY_DATE = 'requestedDeliveryDate',
  SHIPPED_DATE = 'shippedDate',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export class FindSalesOrdersDto {
  // Pagination
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  // Sorting
  @IsOptional()
  @IsEnum(SortableSalesOrderFields)
  sortBy?: SortableSalesOrderFields = SortableSalesOrderFields.CREATED_AT;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  // Filters
  @IsOptional()
  @IsString()
  search?: string; // searches in orderNumber or customer

  @IsOptional()
  @IsEnum(SalesOrderStatusType)
  status?: SalesOrderStatusType;

  @IsOptional()
  @IsString()
  customer?: string; // partial match

  @IsOptional()
  @IsDateString()
  orderDateFrom?: string; // YYYY-MM-DD

  @IsOptional()
  @IsDateString()
  orderDateTo?: string;

  @IsOptional()
  @IsDateString()
  requestedDeliveryFrom?: string;

  @IsOptional()
  @IsDateString()
  requestedDeliveryTo?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minTotalAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  maxTotalAmount?: number;
}

export class PaginatedSalesOrderResponseDto {
  @ApiProperty({ type: [SalesOrderResponseDto] })
  data!: SalesOrderResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;
}
