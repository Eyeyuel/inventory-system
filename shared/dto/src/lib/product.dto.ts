import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString, Length, Min, } from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsString()
  sku?: string;

  @IsString()
  @Length(1, 100)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderPoint?: number;

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
  @IsOptional()
  @IsString()
  categoryId?: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) { }