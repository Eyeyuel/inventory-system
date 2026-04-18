import { ArrayNotEmpty, IsArray, IsDateString, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CreateSalesOrderItemDto, SalesOrderItemResponseDto } from "./salesOrderItem.dto";
import { Type } from "class-transformer";
import { SalesOrderStatusType } from "@inventory-system/types";

export class CreateSalesOrderDto {
    @IsString()
    customer!: string;         // or just customer string if no entity

    @IsString()
    @IsOptional()
    orderNumber?: string;

    @IsDateString()
    @IsOptional()
    orderDate?: string;            // defaults to today if not provided

    @IsDateString()
    @IsOptional()
    requestedDeliveryDate?: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateSalesOrderItemDto)
    items!: CreateSalesOrderItemDto[];
}

export class SalesOrderResponseDto {
    id!: string;
    orderNumber!: string;
    status!: SalesOrderStatusType;
    orderDate?: Date | null;
    requestedDeliveryDate?: Date | null;
    shippedDate?: Date | null;
    totalAmount!: number;
    userId!: string;
    customerId!: string;
    items!: SalesOrderItemResponseDto[];
    createdAt!: Date;
    updatedAt!: Date;
}