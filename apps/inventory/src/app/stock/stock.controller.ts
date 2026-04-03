import { Controller } from '@nestjs/common';
import { StockService } from './stock.service';
import { STOCK_CMD } from '@inventory-system/constants';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateMovementDto, CreateStockDto, UpdateStockDto } from '@inventory-system/dto';


@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) { }

  @MessagePattern(STOCK_CMD.CREATE)
  create(@Payload() payload: { createMovementDto: CreateMovementDto, userId: string }) {
    return this.stockService.createStock(payload.createMovementDto, payload.userId);
  }

  @MessagePattern(STOCK_CMD.FIND)
  findAll(@Payload() payload: { userId: string }) {
    return this.stockService.getStocks(payload.userId);
  }

  // @MessagePattern(STOCK_CMD.FIND_ONE)
  // findOne(@Payload() payload: { id: string, userId: string }) {
  //   return this.stockService.findOne(payload.id, payload.userId);
  // }

  // @MessagePattern(STOCK_CMD.UPDATE)
  // update(@Payload() payload: { id: string, updateStockDto: UpdateStockDto, userId: string }) {
  //   return this.stockService.update(payload.id, payload.updateStockDto, payload.userId);
  // }

  // @MessagePattern(STOCK_CMD.DELETE)
  // remove(@Payload() payload: { id: string, userId: string }) {
  //   return this.stockService.remove(payload.id, payload.userId);
  // }
}
