import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { CreateStockForLocationDto } from './stock.dto';

export class CreateLocationDto {
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;

    // Optional: if you want to create location with initial stock records using cascade
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateStockForLocationDto)
    stocks?: CreateStockForLocationDto[];
}


export class UpdateLocationDto extends PartialType(CreateLocationDto) { }