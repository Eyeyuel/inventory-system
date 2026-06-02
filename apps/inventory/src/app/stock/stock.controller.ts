import { STOCK_CMD } from '@inventory-system/constants';
import {
  AdjustStockDto,
  FindStockMovementsDto,
  FindStocksDto,
  ReceiveStockDto,
  ShipStockDto,
  TransferStockDto,
} from '@inventory-system/dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StockService } from './stock.service';

@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @MessagePattern(STOCK_CMD.FIND)
  findAll(@Payload() payload: { filters: FindStocksDto; userId: string }) {
    return this.stockService.findAll(payload.filters, payload.userId);
  }

  @MessagePattern(STOCK_CMD.FIND_MOVEMENTS)
  findAllStockMovements(@Payload() payload: { filters: FindStockMovementsDto; userId: string }) {
    return this.stockService.findAllStockMovements(payload.filters, payload.userId);
  }

  @MessagePattern(STOCK_CMD.RECEIVE)
  create(@Payload() payload: { reciveStockDto: ReceiveStockDto; userId: string }) {
    return this.stockService.reciveStock(payload.reciveStockDto, payload.userId);
  }

  @MessagePattern(STOCK_CMD.SHIP)
  ship(@Payload() payload: { shipStockDto: ShipStockDto; userId: string }) {
    return this.stockService.ship(payload.shipStockDto, payload.userId);
  }

  @MessagePattern(STOCK_CMD.TRANSFER)
  transfer(@Payload() payload: { transferStockDto: TransferStockDto; userId: string }) {
    return this.stockService.transfer(payload.transferStockDto, payload.userId);
  }

  @MessagePattern(STOCK_CMD.ADJUST)
  adjust(@Payload() payload: { adjustStockDto: AdjustStockDto; userId: string }) {
    return this.stockService.adjust(payload.adjustStockDto, payload.userId);
  }

  @MessagePattern(STOCK_CMD.COUNT)
  getCountStockMovements(@Payload() payload: { userId: string }) {
    return this.stockService.getCountStockMovements(payload.userId);
  }
}
