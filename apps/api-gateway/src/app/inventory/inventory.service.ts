import { INVENTORY_CMD } from "@inventory-system/constants";
import { Inject, Injectable } from "@nestjs/common";
// import { CreateInventoryDto } from "./dto/create-inventory.dto";
// import { UpdateInventoryDto } from "./dto/update-inventory.dto";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class InventoryService {
  constructor(
    @Inject("INVENTORY_SERVICE") private readonly inventoryClient: ClientProxy,
  ) {}
  // create(createInventoryDto: CreateInventoryDto) {
  //   return 'This action adds a new inventory';
  // }

  findAll() {
    return this.inventoryClient.send(INVENTORY_CMD.FIND, {});
    // return "This action returns all inventory fom api-gateway";
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} inventory`;
  // }

  // update(id: number, updateInventoryDto: UpdateInventoryDto) {
  //   return `This action updates a #${id} inventory`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} inventory`;
  // }
}
