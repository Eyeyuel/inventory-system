import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { CategoryModule } from './category/category.module';
import { StockModule } from './stock/stock.module';
import { StockMovementModule } from './stockMovement/stock-movement.module';
import { LocationModule } from './location/location.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }), DatabaseModule, CategoryModule, StockModule, StockMovementModule, LocationModule, ProductModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }




