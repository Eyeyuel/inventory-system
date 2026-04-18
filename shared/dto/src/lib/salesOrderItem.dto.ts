import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateSalesOrderItemDto {
    @IsUUID()
    productId!: string;

    @IsUUID()
    locationId!: string;

    @IsInt()
    @Min(1)
    quantityOrdered!: number;

    @IsInt()
    @Min(0)
    unitPrice!: number;
}

export class SalesOrderItemResponseDto {
    id!: string;
    productId!: string;
    locationId!: string;
    quantityOrdered!: number;
    quantityShipped!: number;
    unitPrice!: number;
    description?: string;
}