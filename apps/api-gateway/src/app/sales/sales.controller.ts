import { Body, Controller, Get, Post } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSalesOrderDto, SalesOrderResponseDto } from '@inventory-system/dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new sales order' })
  @ApiCreatedResponse({ description: 'Sales order created', type: SalesOrderResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid sales order data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  create(@Body() createSaleDto: CreateSalesOrderDto, @CurrentUser() user: { sub: string }) {
    return this.salesService.create(createSaleDto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List all sales orders' })
  @ApiOkResponse({ description: 'Sales orders retrieved', type: [SalesOrderResponseDto] })
  @ApiNotFoundResponse({ description: 'No sales orders found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll(@CurrentUser() user: { sub: string }) {
    return this.salesService.findAll(user.sub);
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
