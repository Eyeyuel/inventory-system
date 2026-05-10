import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { PurchaseOrderItemDto, PurchaseOrderItemResponseDto } from './purchaseOrderItem.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PurchaseOrderStatusType } from '@inventory-system/types';

export class CreatePurchaseOrderDto {
  @ApiProperty({ example: 'Acme Supplies', description: 'Name of the supplier', nullable: false })
  @IsString()
  supplier!: string;

  // @ApiProperty({ example: 'PO-001', description: 'Purchase order number', nullable: true })
  // @IsString()
  // @IsOptional()
  // orderNumber?: string;

  @ApiProperty({ example: '2023-12-31', description: 'Expected delivery date', nullable: true })
  @IsDateString()
  @IsOptional()
  expectedDeliveryDate?: string;

  @ApiProperty({
    type: [PurchaseOrderItemDto],
    description: 'List of items in the purchase order',
    examples: [
      {
        productId: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e',
        locationId: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e',
        quantityOrdered: 10,
        unitCost: 100,
      },
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderItemDto)
  items!: PurchaseOrderItemDto[];
}

// Optional: Response DTO (includes generated fields)
export class PurchaseOrderResponseDto {
  @ApiProperty({
    example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e',
    description: 'Unique identifier for the purchase order',
  })
  id!: string;
  @ApiProperty({ example: 'PO-001', description: 'Purchase order number' })
  orderNumber!: string;
  @ApiProperty({ example: 'Pending', description: 'Current status of the purchase order' })
  status!: string;
  @ApiProperty({ example: '2023-12-31', description: 'Expected delivery date', nullable: true })
  expectedDeliveryDate?: Date | null;
  @ApiProperty({
    example: '2023-12-15',
    description: 'Date when the order was received',
    nullable: true,
  })
  receivedDate?: Date | null;
  @ApiProperty({ example: 1000, description: 'Total cost of the purchase order' })
  totalCost!: number;
  @ApiProperty({
    example: '2023-12-15',
    description: 'Date when the purchase order was created',
    nullable: true,
  })
  createdAt!: Date;
  @ApiProperty({
    example: '2023-12-15',
    description: 'Date when the purchase order was last updated',
    nullable: true,
  })
  updatedAt!: Date;
  @ApiProperty({ example: 'Acme Supplies', description: 'Name of the supplier' })
  supplier!: string;
  @ApiProperty({
    example: '27b5030c-71d6-45e5-b9d8-d0cd79bfaca0',
    description: 'User ID that owns the purchase order',
    format: 'uuid',
  })
  user!: string;
  @ApiProperty({
    type: [PurchaseOrderItemResponseDto],
    description: 'List of items in the purchase order',
  })
  items!: PurchaseOrderItemResponseDto[];
}

export enum SortablePurchaseOrderFields {
  ORDER_NUMBER = 'orderNumber',
  STATUS = 'status',
  TOTAL_COST = 'totalCost',
  EXPECTED_DELIVERY_DATE = 'expectedDeliveryDate',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export class FindPurchaseOrdersDto {
  // Pagination
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  // Sorting
  @IsOptional()
  @IsEnum(SortablePurchaseOrderFields)
  sortBy?: SortablePurchaseOrderFields = SortablePurchaseOrderFields.CREATED_AT;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  // Filters
  @IsOptional()
  @IsString()
  search?: string; // searches in orderNumber or supplier

  @IsOptional()
  @IsEnum(PurchaseOrderStatusType)
  status?: PurchaseOrderStatusType;

  @IsOptional()
  @IsString()
  supplier?: string; // partial match

  @IsOptional()
  @IsDateString()
  expectedDeliveryFrom?: string; // YYYY-MM-DD

  @IsOptional()
  @IsDateString()
  expectedDeliveryTo?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minTotalCost?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  maxTotalCost?: number;
}

export class PaginatedPurchaseOrderResponseDto {
  @ApiProperty({ type: [PurchaseOrderResponseDto] })
  data!: PurchaseOrderResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;
}
