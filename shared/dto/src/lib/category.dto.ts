import { IsString, IsOptional, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

import { PartialType } from '@nestjs/mapped-types';
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }