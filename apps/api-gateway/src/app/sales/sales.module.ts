import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { SalesOrderClientModule } from '../clients/salesOrder.client.module';

@Module({
  imports: [SalesOrderClientModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule { }
