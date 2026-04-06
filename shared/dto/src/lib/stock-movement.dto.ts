import { IsUUID, IsInt, Min, IsString, IsOptional, IsIn, Max, IsDateString, IsEnum } from 'class-validator';
import { StockMovementReasonsTypeForAdjust, StockMovementType } from '@inventory-system/types';
import { Type } from 'class-transformer';

export class ReceiveStockDto {
    @IsUUID()
    productId!: string;

    @IsUUID()
    locationId!: string;

    @IsInt()
    @Min(1)
    quantity!: number;

    @IsString()
    @IsIn(['opening_stock', 'purchase_receipt', 'return', 'transfer_in', 'gift', 'adjustment_in'])
    reasonCode!: string;

    @IsOptional()
    reason?: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    @IsString()
    referenceId?: string;

    // @IsUUID()
    // userId!: string;
}

export class ShipStockDto {
    @IsUUID()
    productId!: string;

    @IsUUID()
    locationId!: string;

    @IsInt()
    @Min(1)
    quantity!: number;

    @IsString()
    @IsIn(['sale', 'transfer_out', 'sample', 'damage_disposal', 'adjustment_out'])
    reasonCode!: string;

    @IsOptional()
    reason?: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    @IsString()
    referenceId?: string;

    // @IsUUID()
    // userId!: string;
}

export class TransferStockDto {
    // maybe just pass the stockId you can get the fromLocationId and productId from it
    @IsUUID()
    productId!: string;

    @IsUUID()
    fromLocationId!: string;

    @IsUUID()
    toLocationId!: string;

    @IsInt()
    @Min(1)
    quantity!: number;

    @IsOptional({})
    reason?: string;

    @IsOptional()
    description?: string;

}

export class AdjustStockDto {
    @IsUUID()
    productId!: string;

    @IsUUID()
    locationId!: string;

    @IsInt()
    @Min(-999999)
    @Max(999999)
    quantityChange!: number; // can be negative

    @IsEnum(StockMovementReasonsTypeForAdjust)
    reasonCode!: StockMovementReasonsTypeForAdjust;

    @IsOptional()
    description?: string;

    @IsOptional()
    @IsString()
    referenceId?: string;
}

export class GetStockMovementsQueryDto {
    @IsOptional()
    @IsUUID()
    stockId?: string;              // filter by specific stock (product+location)

    // @IsOptional()
    // @IsUUID()
    // productId?: string;

    // @IsOptional()
    // @IsUUID()
    // locationId?: string;

    @IsOptional()
    @IsEnum(StockMovementType)
    type?: StockMovementType;

    @IsOptional()
    @IsDateString()
    fromDate?: string;

    @IsOptional()
    @IsDateString()
    toDate?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;             // pagination

    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number = 2;

    @IsOptional()
    referenceId?: string;          // order ID, purchase order ID

    @IsOptional()
    @IsInt()
    @Min(0)
    offset?: number = 0;

    // @IsOptional()
    // userId?: string;               // who performed (if you have user IDs)
}

export class GetStocksQueryDto {
    @IsOptional()
    @IsUUID()
    locationId?: string;

    @IsOptional()
    @IsUUID()
    productId?: string;

}

