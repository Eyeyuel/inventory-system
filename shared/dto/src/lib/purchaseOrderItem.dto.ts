import { Type } from "class-transformer";
import { IsDecimal, IsNumber, IsUUID } from "class-validator";

export class PurchaseOrderItemDto {
    @IsUUID()
    productId!: string;

    @IsUUID()
    locationId!: string;  // where to receive this item

    // @IsDecimal({ decimal_digits: '0,0' })
    @IsNumber()
    quantityOrdered!: number;

    @IsNumber()
    unitCost!: number;
}

export class PurchaseOrderItemResponseDto {
    id!: string;
    productId!: string;
    quantityOrdered!: number;
    quantityReceived!: number;
    unitCost!: number;
}