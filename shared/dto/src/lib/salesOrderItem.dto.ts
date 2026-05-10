import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateSalesOrderItemDto {
    @ApiProperty({ example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e', description: 'Unique identifier for the product', format: 'uuid' })
    @IsUUID()
    productId!: string;

    @ApiProperty({ example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e', description: 'Unique identifier for the location', format: 'uuid' })
    @IsUUID()
    locationId!: string;

    @ApiProperty({ example: 10, description: 'Quantity ordered' })
    @IsInt()
    @Min(1)
    quantityOrdered!: number;

    @ApiProperty({ example: 100, description: 'Unit price of the product' })
    @IsInt()
    @Min(0)
    unitPrice!: number;
}

export class SalesOrderItemResponseDto {
    @ApiProperty({ example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e', description: 'Unique identifier for the sales order item', format: 'uuid' })
    id!: string;
    @ApiProperty({ example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e', description: 'Unique identifier for the product', format: 'uuid' })
    productId!: string;
    @ApiProperty({ example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e', description: 'Unique identifier for the location', format: 'uuid' })
    locationId!: string;
    @ApiProperty({ example: 10, description: 'Quantity ordered' })
    quantityOrdered!: number;
    @ApiProperty({ example: 0, description: 'Quantity shipped' })
    quantityShipped!: number;
    @ApiProperty({ example: 100, description: 'Unit price of the product' })
    unitPrice!: number;
    @ApiProperty({ example: 'Product description', description: 'Description of the product' })
    description?: string;
}