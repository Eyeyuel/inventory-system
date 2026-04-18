import { ArrayNotEmpty, IsArray, IsDateString, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CreateSalesOrderItemDto, SalesOrderItemResponseDto } from "./salesOrderItem.dto";
import { Type } from "class-transformer";
import { SalesOrderStatusType } from "@inventory-system/types";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSalesOrderDto {
    @ApiProperty({ example: 'Acme Supplies', description: 'Name of the supplier', nullable: false })
    @IsString()
    customer!: string;         // or just customer string if no entity

    // @IsString()
    // @IsOptional()
    // orderNumber?: string;

    @ApiProperty({ example: '2023-12-31', description: 'Expected order date', nullable: true })
    @IsDateString()
    @IsOptional()
    orderDate?: string;            // defaults to today if not provided

    @ApiProperty({ example: '2024-01-15', description: 'Requested delivery date', nullable: true })
    @IsDateString()
    @IsOptional()
    requestedDeliveryDate?: string;

    @ApiProperty({ type: [CreateSalesOrderItemDto], description: 'List of items in the sales order', examples: [{ productId: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e', locationId: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e', quantityOrdered: 10, unitPrice: 100 }] })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateSalesOrderItemDto)
    items!: CreateSalesOrderItemDto[];
}

export class SalesOrderResponseDto {
    @ApiProperty({ example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e', description: 'Unique identifier for the sales order' })
    id!: string;
    @ApiProperty({ example: 'SO-001', description: 'Sales order number' })
    orderNumber!: string;
    @ApiProperty({ example: 'Acme Supplies', description: 'Name of the customer' })
    status!: SalesOrderStatusType;
    @ApiProperty({ example: '2023-12-31', description: 'Expected order date', nullable: true })
    orderDate?: Date | null;
    @ApiProperty({ example: '2024-01-15', description: 'Requested delivery date', nullable: true })
    requestedDeliveryDate?: Date | null;
    @ApiProperty({ example: '2024-01-20', description: 'Actual shipped date', nullable: true })
    shippedDate?: Date | null;
    @ApiProperty({ example: 1000, description: 'Total cost of the sales order' })
    totalAmount!: number;
    @ApiProperty({ example: '27b5030c-71d6-45e5-b9d8-d0cd79bfaca0', description: 'User ID that owns the sales order', format: 'uuid' })
    userId!: string;
    @ApiProperty({ example: 'eab399c3-740c-4ae9-b6e5-60a908c96a6e', description: 'Unique identifier for the customer', format: 'uuid' })
    customerId!: string;
    @ApiProperty({ type: [SalesOrderItemResponseDto], description: 'List of items in the sales order' })
    items!: SalesOrderItemResponseDto[];
    @ApiProperty({ example: '2023-12-31T00:00:00.000Z', description: 'Timestamp when the sales order was created' })
    createdAt!: Date;
    @ApiProperty({ example: '2023-12-31T00:00:00.000Z', description: 'Timestamp when the sales order was last updated' })
    updatedAt!: Date;
}