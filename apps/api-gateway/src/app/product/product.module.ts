import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { ConfigModule } from "@nestjs/config";
import { InventoryClientModule } from "../clients/inventory.client.module";

@Module({
  imports: [ConfigModule, InventoryClientModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule { }
