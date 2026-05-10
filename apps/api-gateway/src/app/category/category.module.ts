import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { InventoryClientModule } from "../clients/inventory.client.module";

@Module({
  imports: [InventoryClientModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule { }
