import { IsUUID, IsInt, Min, IsString, IsOptional, IsIn, Max, IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { StockMovementReasonsTypeForAdjust, StockMovementReasonsTypeForReceive, StockMovementType } from '@inventory-system/types';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReceiveStockDto {
    @ApiProperty({
        description: 'Product ID',
        example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e',
        format: 'uuid',
    })
    @IsUUID()
    productId!: string;

    @ApiProperty({
        description: 'Location ID',
        example: 'e15325cd-d115-4559-8147-1eca7445c200',
        format: 'uuid',
    })
    @IsUUID()
    locationId!: string;

    @ApiProperty({
        description: 'Quantity received',
        example: 50,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    quantity!: number;

    @ApiProperty({
        description: 'Reason code for receiving stock',
        example: StockMovementReasonsTypeForReceive.PURCHASE_RECEIPT,
        enum: StockMovementReasonsTypeForReceive,
    })
    @IsEnum(StockMovementReasonsTypeForReceive)
    reasonCode!: StockMovementReasonsTypeForReceive;

    @ApiPropertyOptional({
        description: 'Additional reason details',
        example: 'Received from supplier ABC',
    })
    @IsOptional()
    reason?: string;

    @ApiPropertyOptional({
        description: 'Detailed description',
        example: 'Bulk purchase order #12345',
    })
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        description: 'External reference ID (e.g., PO number)',
        example: 'PO-2026-001',
    })
    @IsOptional()
    @IsString()
    referenceId?: string;
}

export class ShipStockDto {
    @ApiProperty({ description: 'Product UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @IsNotEmpty()
    productId!: string;

    @ApiProperty({ description: 'Location UUID', example: '123e4567-e89b-12d3-a456-426614174001' })
    @IsUUID()
    @IsNotEmpty()
    locationId!: string;

    @ApiProperty({ description: 'Quantity to ship (must be positive)', example: 5, minimum: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    quantity!: number;

    @ApiProperty({
        description: 'Reason code for shipping',
        enum: ['sale', 'transfer_out', 'sample', 'damage_disposal', 'adjustment_out'],
        example: 'sale',
    })
    @IsString()
    @IsIn(['sale', 'transfer_out', 'sample', 'damage_disposal', 'adjustment_out'])
    reasonCode!: string;

    @ApiPropertyOptional({ description: 'Additional reason text', example: 'Customer return' })
    @IsOptional()
    @IsString()
    reason?: string;

    @ApiPropertyOptional({ description: 'Optional description', example: 'Shipped via courier' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'Reference ID (e.g., order number)', example: 'ORD-12345' })
    @IsOptional()
    @IsString()
    referenceId?: string;
}

export class TransferStockDto {
    // maybe just pass the stockId you can get the fromLocationId and productId from it
    @ApiProperty({ description: 'Product UUID to transfer', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @IsNotEmpty()
    productId!: string;

    @ApiProperty({ description: 'Source location UUID', example: '123e4567-e89b-12d3-a456-426614174001' })
    @IsUUID()
    @IsNotEmpty()
    fromLocationId!: string;

    @ApiProperty({ description: 'Destination location UUID', example: '123e4567-e89b-12d3-a456-426614174002' })
    @IsUUID()
    @IsNotEmpty()
    toLocationId!: string;

    @ApiProperty({ description: 'Quantity to transfer (must be positive)', example: 3, minimum: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    quantity!: number;

    @ApiPropertyOptional({ description: 'Reason for transfer', example: 'Stock rebalancing' })
    @IsOptional()
    @IsString()
    reason?: string;

    @ApiPropertyOptional({ description: 'Additional description', example: 'Transfer between warehouses' })
    @IsOptional()
    @IsString()
    description?: string;

}

export class AdjustStockDto {
    @ApiProperty({ description: 'Product UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    productId!: string;

    @ApiProperty({ description: 'Location UUID', example: '123e4567-e89b-12d3-a456-426614174001' })
    @IsUUID()
    locationId!: string;

    @ApiProperty({ description: 'Quantity change (positive = increase, negative = decrease)', example: -5, minimum: -999999, maximum: 999999 })
    @Type(() => Number)
    @IsInt()
    @Min(-999999)
    @Max(999999)
    quantityChange!: number;

    @ApiProperty({ description: 'Reason code for adjustment', enum: StockMovementReasonsTypeForAdjust, example: 'damage' })
    @IsEnum(StockMovementReasonsTypeForAdjust)
    reasonCode!: StockMovementReasonsTypeForAdjust;

    @ApiPropertyOptional({ description: 'Optional description', example: 'Damaged items from warehouse shelf' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'Reference ID (e.g., audit ticket)', example: 'AUDIT-123' })
    @IsOptional()
    @IsString()
    referenceId?: string;
}

export class GetStockMovementsQueryDto {
    @ApiPropertyOptional({
        description: 'Filter by stock record ID',
        example: '3062e2bd-17a8-4a38-8e7a-74965ee52fe8',
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID()
    stockId?: string;

    @ApiPropertyOptional({
        description: 'Filter by movement type',
        example: StockMovementType.SHIP,
        enum: StockMovementType,
    })
    @IsOptional()
    @IsEnum(StockMovementType)
    type?: StockMovementType;

    @ApiPropertyOptional({
        description: 'Start date for filtering (ISO 8601)',
        example: '2026-04-01T00:00:00.000Z',
        format: 'date-time',
    })
    @IsOptional()
    @IsDateString()
    fromDate?: string;

    @ApiPropertyOptional({
        description: 'End date for filtering (ISO 8601)',
        example: '2026-04-10T23:59:59.999Z',
        format: 'date-time',
    })
    @IsOptional()
    @IsDateString()
    toDate?: string;

    @ApiPropertyOptional({
        description: 'Page number for pagination',
        example: 1,
        minimum: 1,
        default: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Number of items per page',
        example: 10,
        minimum: 1,
        default: 10,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit?: number = 10;

    @ApiPropertyOptional({
        description: 'Filter by reference ID (e.g., PO number)',
        example: 'PO-12345',
    })
    @IsOptional()
    referenceId?: string;

    @ApiPropertyOptional({
        description: 'Number of items to skip (for offset pagination)',
        example: 0,
        minimum: 0,
        default: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    offset?: number = 0;
}

export class GetStocksQueryDto {
    @ApiPropertyOptional({ description: 'Location ID', example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e', format: 'uuid' })
    @IsOptional()
    @IsUUID()
    locationId?: string;

    @ApiPropertyOptional({ description: 'Product ID', example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e', format: 'uuid' })
    @IsOptional()
    @IsUUID()
    productId?: string;

}

// Stock Movement Responses
//////////////////////////////////////

// Slimmed-down movement summary
export class ProductNestedDto {
    @ApiProperty({ description: 'Product ID', example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e', format: 'uuid' })
    id!: string;

    @ApiProperty({ description: 'Product name', example: "Abel's 1 product" })
    name!: string;
}

export class LocationNestedDto {
    @ApiProperty({ description: 'Location ID', example: 'e15325cd-d115-4559-8147-1eca7445c200', format: 'uuid' })
    id!: string;

    @ApiProperty({ description: 'Location name', example: "Abel's 1 location" })
    name!: string;
}

export class StockNestedDto {
    @ApiProperty({ description: 'Stock record ID', example: '7c740465-bd4c-4cc9-a273-31497166f268', format: 'uuid' })
    id!: string;

    @ApiProperty({ description: 'Current quantity', example: 100 })
    quantity!: number;

    @ApiProperty({ description: 'Product details', type: ProductNestedDto })
    product!: ProductNestedDto;

    @ApiProperty({ description: 'Location details', type: LocationNestedDto })
    location!: LocationNestedDto;
}

export class StockMovementSummaryDto {
    @ApiProperty({ description: 'Movement ID', example: 'aa169ec1-ebc2-4ddf-86cb-e93bf89fde8b', format: 'uuid' })
    id!: string;

    @ApiProperty({ description: 'Movement type', example: 'receive OR ship OR adjust OR transfer', enum: StockMovementType })
    type!: string;

    @ApiProperty({ description: 'Quantity change (positive = in, negative = out)', example: 10 })
    quantityChange!: number;

    @ApiProperty({ description: 'Timestamp', example: '2026-04-06T09:05:48.130Z', format: 'date-time' })
    createdAt!: Date;

    @ApiPropertyOptional({ description: 'Reason for movement', example: 'reason based on type' })
    reason?: string;

    @ApiPropertyOptional({ description: 'Additional description', example: 'transfer 20 items' })
    description?: string;

    @ApiProperty({ description: 'User ID', example: '27b5030c-71d6-45e5-b9d8-d0cd79bfaca0', format: 'uuid' })
    user!: string;

    @ApiProperty({ description: 'Associated stock record', type: StockNestedDto })
    stock!: StockNestedDto;
}

export class MetaDto {
    @ApiProperty({ description: 'Total number of records', example: 42 })
    total!: number;

    @ApiProperty({ description: 'Current page number', example: 1 })
    page!: number;

    @ApiProperty({ description: 'Items per page', example: 10 })
    limit!: number;

    @ApiProperty({ description: 'Total number of pages', example: 5 })
    totalPages!: number;
}

export class StockMovementResponseDto {
    @ApiProperty({ description: 'List of stock movements', type: [StockMovementSummaryDto] })
    data!: StockMovementSummaryDto[];

    @ApiProperty({ description: 'Pagination metadata', type: MetaDto })
    meta!: MetaDto;
}



// export interface StockMovementSummaryDto {
//   id: string;
//   type: string;  // or StockMovementType if you want to import
//   quantityChange: number;
//   createdAt: Date;
//   reason?: string;
//   description?: string;
//   user: string;
//   stock: {
//     id: string;
//     quantity: number;
//     product: {
//       id: string;
//       name: string;
//     };
//     location: {
//       id: string;
//       name: string;
//     };
//   };
// }

// // Pagination metadata
// export interface MetaDto {
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// // Final response wrapper
// export interface StockMovementResponseDto {
//   data: StockMovementSummaryDto[];
//   meta: MetaDto;
// }

//////////////////////////////////////

