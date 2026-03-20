import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { ProductClientModule } from "../clients/product.client.module";

@Module({
  imports: [ProductClientModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
