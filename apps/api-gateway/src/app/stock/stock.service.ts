import { Inject, Injectable } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { STOCK_CMD } from '@inventory-system/constants';
import { CreateMovementDto, CreateStockDto, UpdateStockDto } from '@inventory-system/dto';

@Injectable()
export class StockService {
  constructor(
    @Inject("INVENTORY_SERVICE") private readonly inventoryClient: ClientProxy
  ) { }
  create(createMovementDto: CreateMovementDto, userId: string) {
    return this.inventoryClient.send(STOCK_CMD.CREATE, { createMovementDto, userId })
  }

  findAll(userId: string) {
    return this.inventoryClient.send(STOCK_CMD.FIND, { userId })
  }

  findOne(id: string, userId: string) {
    return this.inventoryClient.send(STOCK_CMD.FIND_ONE, { id, userId })
  }


  // update(id: string, updateStockDto: UpdateStockDto, userId: string) {
  //   return this.inventoryClient.send(STOCK_CMD.UPDATE, { id, updateStockDto, userId })
  // }

  // remove(id: string, userId: string) {
  //   return this.inventoryClient.send(STOCK_CMD.DELETE, { id, userId })
  // }
}
