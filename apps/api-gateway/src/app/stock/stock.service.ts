import { Inject, Injectable } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { STOCK_CMD } from '@inventory-system/constants';
import {
  AdjustStockDto,
  FindStockMovementsDto,
  FindStocksDto,
  GetStockMovementsQueryDto,
  ReceiveStockDto,
  ShipStockDto,
  TransferStockDto,
} from '@inventory-system/dto';
// import { CreateMovementDto, CreateStockDto, UpdateStockDto } from '@inventory-system/dto';

@Injectable()
export class StockService {
  constructor(@Inject('INVENTORY_SERVICE') private readonly inventoryClient: ClientProxy) {}
  // create(createMovementDto: CreateMovementDto, userId: string) {
  //   return this.inventoryClient.send(STOCK_CMD.CREATE, { createMovementDto, userId })
  // }

  findAll(filters: FindStocksDto, userId: string) {
    return this.inventoryClient.send(STOCK_CMD.FIND, { filters, userId });
  }

  findAllStockMovements(filters: FindStockMovementsDto, userId: string) {
    return this.inventoryClient.send(STOCK_CMD.FIND_MOVEMENTS, { filters, userId });
  }

  reciveStock(reciveStockDto: ReceiveStockDto, userId: string) {
    return this.inventoryClient.send(STOCK_CMD.RECEIVE, { reciveStockDto, userId });
  }
  ship(shipStockDto: ShipStockDto, userId: string) {
    return this.inventoryClient.send(STOCK_CMD.SHIP, { shipStockDto, userId });
  }
  transfer(transferStockDto: TransferStockDto, userId: string) {
    return this.inventoryClient.send(STOCK_CMD.TRANSFER, { transferStockDto, userId });
  }

  adjust(adjustStockDto: AdjustStockDto, userId: string) {
    return this.inventoryClient.send(STOCK_CMD.ADJUST, { adjustStockDto, userId });
  }
}
