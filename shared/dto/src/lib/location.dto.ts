import { IsString, IsOptional, ValidateNested, IsEnum, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStockForLocationDto } from './stock.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({ example: 'Location name', nullable: false })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Location description', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  // Optional: if you want to create location with initial stock records using cascade
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateStockForLocationDto)
  stocks?: CreateStockForLocationDto[];
}

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}

export class LocationResponseDto {
  @ApiProperty({
    description: 'Location unique identifier',
    example: 'e91448e8-c4bd-42ab-b43a-5af04624dd27',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    description: 'Location name',
    example: "Abel's 3 edited location",
  })
  name!: string;

  @ApiProperty({
    description: 'Location description',
    example: 'sone new description',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    description: 'User ID that owns this location',
    example: '27b5030c-71d6-45e5-b9d8-d0cd79bfaca0',
    format: 'uuid',
  })
  user!: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-04-02T12:25:18.019Z',
    format: 'date-time',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-04-02T12:25:18.019Z',
    format: 'date-time',
  })
  updatedAt!: string;

  @ApiProperty({
    description: 'Soft deletion timestamp',
    example: null,
    nullable: true,
    format: 'date-time',
  })
  deletedAt!: string | null;
}

export enum SortableLocationFields {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export class FindLocationsDto {
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 5;

  @IsOptional()
  @IsEnum(SortableLocationFields)
  sortBy?: SortableLocationFields = SortableLocationFields.CREATED_AT;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  search?: string; // searches in name and description
}

export class PaginatedLocationResponseDto {
  @ApiProperty({ type: [LocationResponseDto] })
  data!: LocationResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;
}
