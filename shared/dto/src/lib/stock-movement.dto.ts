import { IsUUID, IsInt, Min, IsString, IsOptional, IsIn, Max, IsDateString, IsEnum } from 'class-validator';
import { StockMovementReasonsTypeForAdjust, StockMovementType } from '@inventory-system/types';

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
    productId?: string;

    @IsOptional()
    @IsUUID()
    locationId?: string;

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
    limit?: number = 100;

    @IsOptional()
    @IsInt()
    @Min(0)
    offset?: number = 0;
}

export class GetStocksQueryDto {
    @IsOptional()
    @IsUUID()
    locationId?: string;

    @IsOptional()
    @IsUUID()
    productId?: string;

}


// // create-movement.dto.ts
// import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
// import { StockMovementType } from '@inventory-system/types';

// export class CreateMovementDto {
//     @IsUUID()
//     productId!: string;

//     @IsUUID()
//     locationId!: string;

//     @IsEnum(StockMovementType)
//     type!: StockMovementType;

//     @IsInt()dddddddddddd
//     quantityChange!: number; // positive or negative

//     @IsOptional()
//     @IsString()
//     referenceId?: string;

//     @IsOptional()
//     @IsString()
//     reason?: string;
// }

// // transfer-stock.dto.ts

// export class TransferStockDto {
//     @IsUUID()
//     productId!: string;

//     @IsUUID()
//     fromLocationId!: string;

//     @IsUUID()
//     toLocationId!: string;

//     @IsInt()
//     quantity!: number; // positive

//     @IsOptional()
//     @IsString()
//     referenceId?: string;

//     @IsOptional()
//     @IsString()
//     reason?: string;
// }

