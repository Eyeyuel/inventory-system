import { AdjustStockDto, GetStockMovementsQueryDto, GetStocksQueryDto, ReceiveStockDto, ShipStockDto, StockMovementResponseDto, StockMovementSummaryDto, StockResponseDto, TransferStockDto } from '@inventory-system/dto';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { StockService } from './stock.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) { }

  // get stock using productId, locationId, userId
  @Get()
  @ApiOperation({ summary: "Get all stocks" })
  @ApiOkResponse({ description: 'Stock retrieved', type: [StockResponseDto] })
  @ApiNotFoundResponse({ description: 'No stock found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll(@CurrentUser() user: { sub: string }, @Query() query: GetStocksQueryDto) {
    return this.stockService.findAll(user.sub, query);
  }


  @Get("movements")
  @ApiOperation({ summary: 'Get all stock movements' })
  @ApiOkResponse({ description: 'Stock movements retrieved', type: StockMovementResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiNotFoundResponse({ description: 'No stock movements found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAllStockMovements(@CurrentUser() user: { sub: string }, @Query() query: GetStockMovementsQueryDto) {
    return this.stockService.findAllStockMovements(user.sub, query);
  }

  // for adding into stock
  @Post("recive")
  @ApiOperation({ summary: 'Receive stock' })
  @ApiCreatedResponse({ description: 'Stock received successfully', type: StockMovementSummaryDto })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Product or Location not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  recive(@Body() receiveStockDto: ReceiveStockDto, @CurrentUser() user: { sub: string }) {
    return this.stockService.reciveStock(receiveStockDto, user.sub);
  }

  // for reducing stock
  @Post("ship")
  @ApiOperation({ summary: 'Ship stock' })
  @ApiCreatedResponse({ description: 'Stock shipped successfully', type: StockMovementSummaryDto })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Product or Location not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  ship(@Body() shipStockDto: ShipStockDto, @CurrentUser() user: { sub: string }) {
    return this.stockService.ship(shipStockDto, user.sub);
  }

  // for transfer of stock between locations
  @Post("transfer")
  @ApiOperation({ summary: 'Transfer stock' })
  @ApiCreatedResponse({ description: 'Transfer shipped successfully', type: StockMovementSummaryDto })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Product or Locations not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  transfer(@Body() transferStockDto: TransferStockDto, @CurrentUser() user: { sub: string }) {
    return this.stockService.transfer(transferStockDto, user.sub);
  }

  @Post("adjust")
  @ApiOperation({ summary: 'Adjust stock' })
  @ApiCreatedResponse({ description: 'Adjust shipped successfully', type: StockMovementSummaryDto })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Product or Locations not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  adjust(@Body() adjustStockDto: AdjustStockDto, @CurrentUser() user: { sub: string }) {
    return this.stockService.adjust(adjustStockDto, user.sub);
  }

}
