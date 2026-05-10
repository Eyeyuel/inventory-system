import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CategoryResponseDto } from './category.dto';
import { Type } from 'class-transformer';

export class CreateProductDto {
  // @ApiPropertyOptional({ description: 'SKU (Stock Keeping Unit)', example: '555 sku', nullable: true })
  @ApiProperty({ example: '555 sku', nullable: true })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ example: 'Product name', nullable: false })
  @IsString()
  @Length(1, 100)
  name!: string;

  @ApiProperty({ example: 'Product description', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 100, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @ApiProperty({ example: 100, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ example: 100, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderPoint?: number;

  @ApiProperty({ example: 100, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  reorderQuantity?: number;

  // // If you want to create product with initial stocks (using cascade)
  // @IsOptional()
  // @ValidateNested({ each: true })
  // @Type(() => CreateStockDto) // define CreateStockDto separately
  // stocks?: CreateStockDto[];

  // Relation fields (IDs)
  @ApiProperty({ example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e', format: 'uuid', nullable: true })
  @IsOptional()
  @IsString()
  categoryId?: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

// Responses

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e',
    format: 'uuid',
  })
  id!: string;

  @ApiPropertyOptional({
    description: 'SKU (Stock Keeping Unit)',
    example: '555 sku',
    nullable: true,
  })
  sku!: string | null;

  @ApiProperty({ description: 'Product name', example: "Abel's 1 product" })
  name!: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'edited new description',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({ description: 'Product cost', example: 100 })
  cost!: number;

  @ApiProperty({ description: 'Selling price', example: 170 })
  price!: number;

  @ApiProperty({ description: 'Reorder point threshold', example: 100 })
  reorderPoint!: number;

  @ApiProperty({ description: 'Quantity to reorder', example: 1000 })
  reorderQuantity!: number;

  @ApiProperty({
    description: 'User ID that owns the product',
    example: '27b5030c-71d6-45e5-b9d8-d0cd79bfaca0',
    format: 'uuid',
  })
  user!: string;

  @ApiPropertyOptional({ description: 'Purchase order items', example: null, nullable: true })
  purchaseOrderItems!: unknown | null;

  @ApiPropertyOptional({ description: 'Sales order items', example: null, nullable: true })
  salesOrderItems!: unknown | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-03-31T14:18:28.436Z',
    format: 'date-time',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-04-02T12:15:17.596Z',
    format: 'date-time',
  })
  updatedAt!: string;

  @ApiPropertyOptional({
    description: 'Soft deletion timestamp',
    example: null,
    nullable: true,
    format: 'date-time',
  })
  deletedAt!: string | null;

  @ApiProperty({ description: 'Product category', type: CategoryResponseDto })
  category!: CategoryResponseDto;
}

export enum SortableProductFields {
  NAME = 'name',
  PRICE = 'price',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  COST = 'cost',
  SKU = 'sku',
  // add others as needed
}

export class FindProductsDto {
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ enum: SortableProductFields, example: SortableProductFields.CREATED_AT })
  @IsOptional()
  @IsEnum(SortableProductFields)
  sortBy?: SortableProductFields = SortableProductFields.CREATED_AT;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], example: 'DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ example: 'laptop' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 0, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 1000, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ example: 5, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minStock?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  withDeleted?: boolean;
}

// export class FindProductsDto {
//   @IsOptional()
//   @Type(() => Number)
//   @Min(1)
//   page?: number = 1;

//   @IsOptional()
//   @Type(() => Number)
//   @Min(1)
//   @Max(100)
//   limit?: number = 10;

//   @IsOptional()
//   @IsEnum(SortableProductFields)
//   sortBy?: SortableProductFields = SortableProductFields.CREATED_AT;

//   @IsOptional()
//   @IsIn(['ASC', 'DESC'])
//   sortOrder?: 'ASC' | 'DESC' = 'DESC';

//   @IsOptional()
//   @IsString()
//   search?: string; // search in name, sku, description

//   @IsOptional()
//   @IsUUID()
//   categoryId?: string;

//   @IsOptional()
//   @Type(() => Number)
//   @Min(0)
//   minPrice?: number;

//   @IsOptional()
//   @Type(() => Number)
//   @Min(0)
//   maxPrice?: number;

//   @IsOptional()
//   @Type(() => Number)
//   @Min(0)
//   minStock?: number; // filter products with total stock >= this value

//   // Include deleted? (soft delete)
//   @IsOptional()
//   withDeleted?: boolean;
// }

// dto/paginated-product-response.dto.ts
export class PaginatedProductResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  data!: ProductResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;
}
