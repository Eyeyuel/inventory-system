import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  unitOfMeasurment!: string;

  @IsNotEmpty()
  @IsNumber()
  costPrice!: number;

  @IsNotEmpty()
  @IsNumber()
  sellingPrice!: number;

  @IsNotEmpty()
  @IsNumber()
  quantity!: number;

  @IsNotEmpty()
  @IsNumber()
  categoryId!: number;

  // @IsNotEmpty()
  // @IsNumber()
  // userId!: number;
}
