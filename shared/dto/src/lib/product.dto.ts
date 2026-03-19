import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

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
  @IsString()
  costPrice!: number;

  @IsNotEmpty()
  @IsString()
  sellingPrice!: number;

  @IsNotEmpty()
  @IsString()
  categoryId!: number;

  @IsOptional()
  @IsString()
  supplierId!: number;
}
