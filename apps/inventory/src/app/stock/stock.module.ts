import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from '@inventory-system/entities';
import { Location } from '@inventory-system/entities';
import { Product } from '@inventory-system/entities';
import { ProductModule } from '../product/product.module';
import { LocationModule } from '../location/location.module';
import { StockMovement } from '@inventory-system/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, Location, Product, StockMovement]), LocationModule, ProductModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule { }
