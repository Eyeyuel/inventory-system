import { Inject, Injectable } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { STOCK_CMD } from '@inventory-system/constants';
import { GetStocksQueryDto, ReceiveStockDto, ShipStockDto, TransferStockDto } from '@inventory-system/dto';
// import { CreateMovementDto, CreateStockDto, UpdateStockDto } from '@inventory-system/dto';

@Injectable()
export class StockService {
  constructor(
    @Inject("INVENTORY_SERVICE") private readonly inventoryClient: ClientProxy
  ) { }
  // create(createMovementDto: CreateMovementDto, userId: string) {
  //   return this.inventoryClient.send(STOCK_CMD.CREATE, { createMovementDto, userId })
  // }

  findAll(userId: string, filters: GetStocksQueryDto) {
    const where: any = {}
    if (filters.locationId) where.locationId = filters.locationId;
    if (filters.productId) where.productId = filters.productId;
    return this.inventoryClient.send(STOCK_CMD.FIND, { userId, where })
  }

  reciveStock(reciveStockDto: ReceiveStockDto, userId: string) {
    return this.inventoryClient.send(STOCK_CMD.RECEIVE, { reciveStockDto, userId })
  }
  ship(shipStockDto: ShipStockDto, userId: string) {
    return this.inventoryClient.send(STOCK_CMD.SHIP, { shipStockDto, userId })
  }
  transfer(transferStockDto: TransferStockDto, userId: string) {
    return this.inventoryClient.send(STOCK_CMD.TRANSFER, { transferStockDto, userId })
  }

  // findOne(id: string, userId: string) {
  //   return this.inventoryClient.send(STOCK_CMD.FIND_ONE, { id, userId })
  // }


  // update(id: string, updateStockDto: UpdateStockDto, userId: string) {
  //   return this.inventoryClient.send(STOCK_CMD.UPDATE, { id, updateStockDto, userId })
  // }

  // remove(id: string, userId: string) {
  //   return this.inventoryClient.send(STOCK_CMD.DELETE, { id, userId })
  // }
}
