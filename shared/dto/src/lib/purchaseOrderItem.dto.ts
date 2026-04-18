import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsUUID, Min } from "class-validator";

export class PurchaseOrderItemDto {
    @ApiProperty({ example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e', description: 'Product UUID' })
    @IsUUID()
    productId!: string;

    @ApiProperty({ example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e', description: 'Location UUID' })
    @IsUUID()
    locationId!: string;  // where to receive this item

    // @IsDecimal({ decimal_digits: '0,0' })
    @ApiProperty({ example: 10, description: 'Quantity ordered' })
    @IsNumber()
    @Min(1)  // quantityOrdered must be at least 1
    quantityOrdered!: number;

    @ApiProperty({ example: 100, description: 'Unit cost' })
    @IsNumber()
    @Min(0)  // unitCost cannot be negative
    unitCost!: number;
}

export class PurchaseOrderItemResponseDto {
    @ApiProperty({ example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e', description: 'Unique identifier for the purchase order item' })
    id!: string;
    @ApiProperty({ example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e', description: 'Product UUID' })
    productId!: string;
    @ApiProperty({ example: 10, description: 'Quantity ordered' })
    quantityOrdered!: number;
    @ApiProperty({ example: 0, description: 'Quantity received' })
    quantityReceived!: number;
    @ApiProperty({ example: 100, description: 'Unit cost' })
    unitCost!: number;
}