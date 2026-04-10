import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LocationResponseDto } from './location.dto';
import { ProductResponseDto } from './product.dto';


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


// Reuse existing DTOs or define inline if not available elsewhere

export class StockResponseDto {
    @ApiProperty({ description: 'Stock record ID', example: '3062e2bd-17a8-4a38-8e7a-74965ee52fe8', format: 'uuid' })
    id!: string;

    @ApiProperty({ description: 'Quantity in stock', example: 150 })
    quantity!: number;

    @ApiProperty({ description: 'Owner user ID', example: '27b5030c-71d6-45e5-b9d8-d0cd79bfaca0', format: 'uuid' })
    user!: string;

    @ApiProperty({ description: 'Location details', type: LocationResponseDto })
    location!: LocationResponseDto;

    @ApiProperty({ description: 'Product details', type: ProductResponseDto })
    product!: ProductResponseDto;
}