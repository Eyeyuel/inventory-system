import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockService } from './stock.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateMovementDto, UpdateStockDto } from '@inventory-system/dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) { }

  @Post()
  create(@Body() createMovementDto: CreateMovementDto, @CurrentUser() user: { sub: string }) {
    return this.stockService.create(createMovementDto, user.sub);
  }

  @Get()
  findAll(@CurrentUser() user: { sub: string },) {
    return this.stockService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.stockService.findOne(id, user.sub);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto, @CurrentUser() user: { sub: string }) {
  //   return this.stockService.update(id, updateStockDto, user.sub);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
  //   return this.stockService.remove(id, user.sub);
  // }
}
