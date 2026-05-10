import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
import {
  CreateSalesOrderDto,
  FindSalesOrdersDto,
  PaginatedSalesOrderResponseDto,
  SalesOrderResponseDto,
} from '@inventory-system/dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_PRESETS } from '../common/throttle-presets';

@ApiBearerAuth()
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Throttle({ [THROTTLE_PRESETS.sales.name]: THROTTLE_PRESETS.sales })
  @Post()
  @ApiOperation({ summary: 'Create a new sales order' })
  @ApiCreatedResponse({ description: 'Sales order created', type: SalesOrderResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid sales order data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  create(@Body() createSaleDto: CreateSalesOrderDto, @CurrentUser() user: { sub: string }) {
    return this.salesService.create(createSaleDto, user.sub);
  }

  @Throttle({ [THROTTLE_PRESETS.sales.name]: THROTTLE_PRESETS.sales })
  @Get()
  @ApiOperation({ summary: 'List all sales orders' })
  @ApiOkResponse({
    description: 'Sales orders retrieved',
    type: PaginatedSalesOrderResponseDto,
  })
  @ApiNotFoundResponse({ description: 'No sales orders found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll(@Query() filters: FindSalesOrdersDto, @CurrentUser() user: { sub: string }) {
    return this.salesService.findAll(filters, user.sub);
  }

  @Throttle({ [THROTTLE_PRESETS.sales.name]: THROTTLE_PRESETS.sales })
  @Get(':id')
  @ApiOperation({ summary: 'Get a sales order by ID' })
  @ApiOkResponse({
    description: 'Sales order retrieved',
    type: SalesOrderResponseDto,
  })
  @ApiNotFoundResponse({ description: 'No sales orders found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findOne(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.salesService.findOne(id, user.sub);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.salesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
  //   return this.salesService.update(+id, updateSaleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.salesService.remove(+id);
  // }
}
