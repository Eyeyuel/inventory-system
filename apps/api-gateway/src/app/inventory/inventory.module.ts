import { Module } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { InventoryController } from "./inventory.controller";
import { InventoryClientModule } from "../clients/inventory.client.module";

@Module({
  imports: [InventoryClientModule],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
