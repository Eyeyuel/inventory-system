import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { ProductsModule } from "./products/products.module";
import { DatabaseModule } from "./database/database.module";
import { CategoryModule } from './category/category.module';
import { LocationModule } from './location/location.module';
import { StockModule } from './stock/stock.module';
import { StockMovementModule } from './stockMovement/stock-movement.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    DatabaseModule,
    ProductsModule,
    CategoryModule,
    LocationModule,
    StockModule,
    StockMovementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
