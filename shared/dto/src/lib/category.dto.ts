import { IsString, IsOptional, Length, IsEnum, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

// response

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Category ID',
    example: 'f5f55d88-13f8-40bb-a0d1-6355f8b612ac',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({ description: 'Category name', example: "Abel's first category" })
  name!: string;

  @ApiPropertyOptional({ description: 'Category description', example: null, nullable: true })
  description!: string | null;

  @ApiProperty({
    description: 'User ID that owns the category',
    example: '27b5030c-71d6-45e5-b9d8-d0cd79bfaca0',
    format: 'uuid',
  })
  user!: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-03-31T13:36:27.273Z',
    format: 'date-time',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-03-31T13:36:27.273Z',
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
}

export enum SortableCategoryFields {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export class FindCategoriesDto {
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 5;

  @IsOptional()
  @IsEnum(SortableCategoryFields)
  sortBy?: SortableCategoryFields = SortableCategoryFields.CREATED_AT;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  search?: string; // searches in name and description
}

// dto/paginated-category-response.dto.ts
export class PaginatedCategoryResponseDto {
  @ApiProperty({ type: [CategoryResponseDto] })
  data!: CategoryResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;
}
