import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Category name', nullable: false })
  @IsString()
  @Length(1, 100)
  name!: string;

  @ApiProperty({ example: 'Category description', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }

// response

export class CategoryResponseDto {
  @ApiProperty({ description: 'Category ID', example: 'f5f55d88-13f8-40bb-a0d1-6355f8b612ac', format: 'uuid' })
  id!: string;

  @ApiProperty({ description: 'Category name', example: "Abel's first category" })
  name!: string;

  @ApiPropertyOptional({ description: 'Category description', example: null, nullable: true })
  description!: string | null;

  @ApiProperty({ description: 'User ID that owns the category', example: '27b5030c-71d6-45e5-b9d8-d0cd79bfaca0', format: 'uuid' })
  user!: string;

  @ApiProperty({ description: 'Creation timestamp', example: '2026-03-31T13:36:27.273Z', format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ description: 'Last update timestamp', example: '2026-03-31T13:36:27.273Z', format: 'date-time' })
  updatedAt!: string;

  @ApiPropertyOptional({ description: 'Soft deletion timestamp', example: null, nullable: true, format: 'date-time' })
  deletedAt!: string | null;
}