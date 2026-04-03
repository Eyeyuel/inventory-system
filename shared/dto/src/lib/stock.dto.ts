import { IsNumber, Min, IsUUID, IsOptional, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';


export class CreateStockDto {
    @IsNumber()
    @Min(0)
    quantity!: number;

    @IsUUID()
    productId!: string;  // ID of the product this stock belongs to

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


export class UpdateStockDto extends PartialType(CreateStockDto) { }