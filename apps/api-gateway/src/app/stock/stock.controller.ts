import { AdjustStockDto, GetStockMovementsQueryDto, GetStocksQueryDto, ReceiveStockDto, ShipStockDto, TransferStockDto } from '@inventory-system/dto';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) { }

  @Get()
  // get stock using productId, locationId, userId
  findAll(@CurrentUser() user: { sub: string }, @Query() query: GetStocksQueryDto) {
    return this.stockService.findAll(user.sub, query);
  }
  @Get("movements")
  findAllStockMovements(@CurrentUser() user: { sub: string }, @Query() query: GetStockMovementsQueryDto) {
    return this.stockService.findAllStockMovements(user.sub, query);
  }

  // for adding into stock
  @Post("recive")
  recive(@Body() receiveStockDto: ReceiveStockDto, @CurrentUser() user: { sub: string }) {
    return this.stockService.reciveStock(receiveStockDto, user.sub);
  }

  // for recucing stock
  @Post("ship")
  ship(@Body() shipStockDto: ShipStockDto, @CurrentUser() user: { sub: string }) {
    return this.stockService.ship(shipStockDto, user.sub);
  }

  // for transfer of stock between locations
  @Post("transfer")
  transfer(@Body() transferStockDto: TransferStockDto, @CurrentUser() user: { sub: string }) {
    return this.stockService.transfer(transferStockDto, user.sub);
  }

  @Post("adjust")
  adjust(@Body() adjustStockDto: AdjustStockDto, @CurrentUser() user: { sub: string }) {
    return this.stockService.adjust(adjustStockDto, user.sub);
  }

}
