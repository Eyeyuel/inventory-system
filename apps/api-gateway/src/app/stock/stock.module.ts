import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { InventoryClientModule } from '../clients/inventory.client.module';

@Module({
  imports: [InventoryClientModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule { }
