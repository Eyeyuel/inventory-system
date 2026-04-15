import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PurchaseOrderItemDto, PurchaseOrderItemResponseDto } from './purchaseOrderItem.dto';

export class CreatePurchaseOrderDto {
    @IsString()
    supplier!: string;

    @IsDateString()
    @IsOptional()
    expectedDeliveryDate?: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => PurchaseOrderItemDto)
    items!: PurchaseOrderItemDto[];
}



// Optional: Response DTO (includes generated fields)
export class PurchaseOrderResponseDto {
    id!: string;
    orderNumber!: string;
    status!: string;
    expectedDeliveryDate?: Date | null;
    receivedDate?: Date | null;
    totalCost!: number;
    createdAt!: Date;
    updatedAt!: Date;
    supplier!: string;
    user!: string
    items!: PurchaseOrderItemResponseDto[];
}

