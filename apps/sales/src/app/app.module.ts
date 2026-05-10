import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SalesOrderModule } from './salesOrder/sales-order.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, SalesOrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
