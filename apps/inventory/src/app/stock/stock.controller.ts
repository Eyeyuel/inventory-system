import { Controller } from '@nestjs/common';
import { StockService } from './stock.service';
import { STOCK_CMD } from '@inventory-system/constants';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdjustStockDto, GetStocksQueryDto, ReceiveStockDto, ShipStockDto, TransferStockDto } from '@inventory-system/dto';


@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) { }

  @MessagePattern(STOCK_CMD.FIND)
  findAll(@Payload() payload: { userId: string, where: GetStocksQueryDto }) {
    return this.stockService.getStocks(payload.userId, payload.where);
  }

  @MessagePattern(STOCK_CMD.RECEIVE)
  create(@Payload() payload: { reciveStockDto: ReceiveStockDto, userId: string }) {
    return this.stockService.reciveStock(payload.reciveStockDto, payload.userId);
  }

  @MessagePattern(STOCK_CMD.SHIP)
  ship(@Payload() payload: { shipStockDto: ShipStockDto, userId: string }) {
    return this.stockService.ship(payload.shipStockDto, payload.userId);
  }

  @MessagePattern(STOCK_CMD.TRANSFER)
  transfer(@Payload() payload: { transferStockDto: TransferStockDto, userId: string }) {
    return this.stockService.transfer(payload.transferStockDto, payload.userId);
  }

  @MessagePattern(STOCK_CMD.ADJUST)
  adjust(@Payload() payload: { adjustStockDto: AdjustStockDto, userId: string }) {
    return this.stockService.adjust(payload.adjustStockDto, payload.userId);
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
