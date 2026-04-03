import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Location } from '../location/entities/location.entity';
import { Product } from '../product/entities/product.entity';
import { ProductModule } from '../product/product.module';
import { LocationModule } from '../location/location.module';
import { StockMovement } from '../stockMovement/entities/stock-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, Location, Product, StockMovement]), LocationModule, ProductModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule { }
