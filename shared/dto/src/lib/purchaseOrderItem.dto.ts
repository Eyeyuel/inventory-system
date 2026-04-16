import { IsNumber, IsUUID, Min } from "class-validator";

export class PurchaseOrderItemDto {
    @IsUUID()
    productId!: string;

    @IsUUID()
    locationId!: string;  // where to receive this item

    // @IsDecimal({ decimal_digits: '0,0' })
    @IsNumber()
    @Min(1)  // quantityOrdered must be at least 1
    quantityOrdered!: number;

    @IsNumber()
    @Min(0)  // unitCost cannot be negative
    unitCost!: number;
}

export class PurchaseOrderItemResponseDto {
    id!: string;
    productId!: string;
    quantityOrdered!: number;
    quantityReceived!: number;
    unitCost!: number;
}