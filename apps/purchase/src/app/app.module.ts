import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PurchaseOrderModule } from './purchaseOrder/purchase-order.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, PurchaseOrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
