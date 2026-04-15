import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PurchaseOrderModule } from './purchaseOrder/purchase-order.module';
import { ConfigModule } from '@nestjs/config';
import { PurchaseOrderItemModule } from './purchaseOrderItem/purchase-order-item.module';

@Module({
  imports: [PurchaseOrderModule, ConfigModule.forRoot({ isGlobal: true }), PurchaseOrderItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
