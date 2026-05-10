import {
  AdjustStockDto,
  FindStockMovementsDto,
  FindStocksDto,
  GetStockMovementsQueryDto,
  PaginatedStockMovementResponseDto,
  PaginatedStockResponseDto,
  ReceiveStockDto,
  ShipStockDto,
  StockMovementResponseDto,
  StockMovementSummaryDto,
  StockResponseDto,
  TransferStockDto,
} from '@inventory-system/dto';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { StockService } from './stock.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_PRESETS } from '../common/throttle-presets';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  // get stock using productId, locationId, userId
  @Throttle({ [THROTTLE_PRESETS.stock.name]: THROTTLE_PRESETS.stock })
  @Get()
  @ApiOperation({ summary: 'Get all stocks' })
  @ApiOkResponse({ description: 'Stocks retrieved', type: PaginatedStockResponseDto })
  @ApiNotFoundResponse({ description: 'No stock found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll(@CurrentUser() user: { sub: string }, @Query() filters: FindStocksDto) {
    return this.stockService.findAll(filters, user.sub);
  }

  @Throttle({ [THROTTLE_PRESETS.stock.name]: THROTTLE_PRESETS.stock })
  @Get('movements')
  @ApiOperation({ summary: 'Get all stock movements' })
  @ApiOkResponse({
    description: 'Stock movements retrieved',
    type: PaginatedStockMovementResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiNotFoundResponse({ description: 'No stock movements found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAllStockMovements(
    @CurrentUser() user: { sub: string },
    @Query() filters: FindStockMovementsDto,
  ) {
    return this.stockService.findAllStockMovements(filters, user.sub);
  }

  // for adding into stock
  @Throttle({ [THROTTLE_PRESETS.stock.name]: THROTTLE_PRESETS.stock })
  @Post('recive')
  @ApiOperation({ summary: 'Receive stock' })
  @ApiCreatedResponse({ description: 'Stock received successfully', type: StockMovementSummaryDto })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Product or Location not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  recive(@Body() receiveStockDto: ReceiveStockDto, @CurrentUser() user: { sub: string }) {
    return this.stockService.reciveStock(receiveStockDto, user.sub);
  }

  // for reducing stock
  @Throttle({ [THROTTLE_PRESETS.stock.name]: THROTTLE_PRESETS.stock })
  @Post('ship')
  @ApiOperation({ summary: 'Ship stock' })
  @ApiCreatedResponse({ description: 'Stock shipped successfully', type: StockMovementSummaryDto })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Product or Location not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  ship(@Body() shipStockDto: ShipStockDto, @CurrentUser() user: { sub: string }) {
    return this.stockService.ship(shipStockDto, user.sub);
  }

  // for transfer of stock between locations
  @Throttle({ [THROTTLE_PRESETS.stock.name]: THROTTLE_PRESETS.stock })
  @Post('transfer')
  @ApiOperation({ summary: 'Transfer stock' })
  @ApiCreatedResponse({
    description: 'Transfer shipped successfully',
    type: StockMovementSummaryDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Product or Locations not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  transfer(@Body() transferStockDto: TransferStockDto, @CurrentUser() user: { sub: string }) {
    return this.stockService.transfer(transferStockDto, user.sub);
  }

  @Throttle({ [THROTTLE_PRESETS.stock.name]: THROTTLE_PRESETS.stock })
  @Post('adjust')
  @ApiOperation({ summary: 'Adjust stock' })
  @ApiCreatedResponse({ description: 'Adjust shipped successfully', type: StockMovementSummaryDto })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Product or Locations not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  adjust(@Body() adjustStockDto: AdjustStockDto, @CurrentUser() user: { sub: string }) {
    return this.stockService.adjust(adjustStockDto, user.sub);
  }
}
