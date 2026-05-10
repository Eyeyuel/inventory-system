import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LocationResponseDto } from './location.dto';
import { ProductResponseDto } from './product.dto';
import { Type } from 'class-transformer';

export class CreateStockDto {
  @IsNumber()
  @Min(0)
  quantity!: number;

  @IsUUID()
  productId!: string; // ID of the product this stock belongs to

  @IsNotEmpty()
  @IsUUID()
  locationId!: string; // optional – if not provided, stock is not tied to a location
}

export class CreateStockForLocationDto {
  @IsNumber()
  @Min(0)
  quantity!: number;

  @IsUUID()
  productId!: string; // product to link
}

export class UpdateStockDto extends PartialType(CreateStockDto) {}

// Reuse existing DTOs or define inline if not available elsewhere

export class StockResponseDto {
  @ApiProperty({
    description: 'Stock record ID',
    example: '3062e2bd-17a8-4a38-8e7a-74965ee52fe8',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({ description: 'Quantity in stock', example: 150 })
  quantity!: number;

  @ApiProperty({
    description: 'Owner user ID',
    example: '27b5030c-71d6-45e5-b9d8-d0cd79bfaca0',
    format: 'uuid',
  })
  user!: string;

  @ApiProperty({ description: 'Location details', type: LocationResponseDto })
  location!: LocationResponseDto;

  @ApiProperty({ description: 'Product details', type: ProductResponseDto })
  product!: ProductResponseDto;
}

export enum SortableStockFields {
  QUANTITY = 'quantity',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  PRODUCT_NAME = 'product.name',
  LOCATION_NAME = 'location.name',
}

export class FindStocksDto {
  // Pagination
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  // Sorting
  @IsOptional()
  @IsEnum(SortableStockFields)
  sortBy?: SortableStockFields = SortableStockFields.CREATED_AT;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  // Filters
  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @IsUUID()
  locationId?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minQuantity?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  maxQuantity?: number;

  // Search across product name or location name
  @IsOptional()
  @IsString()
  search?: string;
}

export class PaginatedStockResponseDto {
  @ApiProperty({ type: [StockResponseDto] })
  data!: StockResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;
}
