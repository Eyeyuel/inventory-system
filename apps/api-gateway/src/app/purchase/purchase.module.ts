import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { PurchaseOrderClientModule } from '../clients/purchseOrder.client.module';

@Module({
  imports: [PurchaseOrderClientModule],
  controllers: [PurchaseController],
  providers: [PurchaseService],
})
export class PurchaseModule { }
