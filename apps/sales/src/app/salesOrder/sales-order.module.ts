import { Module } from '@nestjs/common';
import { SalesOrderService } from './sales-order.service';
import { SalesOrderController } from './sales-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category, Location, Product, SalesOrder, SalesOrderItem, Stock, StockMovement } from '@inventory-system/entities';

@Module({
  imports: [TypeOrmModule.forFeature([SalesOrder, SalesOrderItem, Product, Category, Location, Stock, StockMovement])],
  controllers: [SalesOrderController],
  providers: [SalesOrderService],
})
export class SalesOrderModule { }
