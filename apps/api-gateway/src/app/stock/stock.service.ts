import { Inject, Injectable } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { STOCK_CMD } from '@inventory-system/constants';
import { AdjustStockDto, GetStockMovementsQueryDto, GetStocksQueryDto, ReceiveStockDto, ShipStockDto, TransferStockDto } from '@inventory-system/dto';
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

  findAllStockMovements(userId: string, filters: GetStockMovementsQueryDto) {
    return this.inventoryClient.send(STOCK_CMD.FIND_MOVEMENTS, { filters, userId })
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

  adjust(adjustStockDto: AdjustStockDto, userId: string) {
    return this.inventoryClient.send(STOCK_CMD.ADJUST, { adjustStockDto, userId })
  }
}
