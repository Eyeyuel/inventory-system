import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderItem, Stock, StockMovement, Product, Location, PurchaseOrder } from '@inventory-system/entities';
import { ProductModule } from '../product/product.module';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, Location, Product, StockMovement, PurchaseOrder, PurchaseOrderItem]), LocationModule, ProductModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule { }
