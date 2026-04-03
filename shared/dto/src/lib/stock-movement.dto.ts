// create-movement.dto.ts
import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { StockMovementType } from '@inventory-system/types';

export class CreateMovementDto {
    @IsUUID()
    productId!: string;

    @IsUUID()
    locationId!: string;

    @IsEnum(StockMovementType)
    type!: StockMovementType;

    @IsInt()
    quantityChange!: number; // positive or negative

    @IsOptional()
    @IsString()
    referenceId?: string;

    @IsOptional()
    @IsString()
    reason?: string;
}

// transfer-stock.dto.ts

export class TransferStockDto {
    @IsUUID()
    productId!: string;

    @IsUUID()
    fromLocationId!: string;

    @IsUUID()
    toLocationId!: string;

    @IsInt()
    quantity!: number; // positive

    @IsOptional()
    @IsString()
    referenceId?: string;

    @IsOptional()
    @IsString()
    reason?: string;
}

