import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { ConfigModule } from "@nestjs/config";
import { ProductClientModule } from "../clients/product.client.module";

@Module({
  imports: [ConfigModule, ProductClientModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
