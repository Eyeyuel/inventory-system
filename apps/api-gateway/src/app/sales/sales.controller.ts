import { Body, Controller, Get, Post } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSalesOrderDto } from '@inventory-system/dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) { }

  @Post()
  create(@Body() createSaleDto: CreateSalesOrderDto, @CurrentUser() user: { sub: string }) {
    return this.salesService.create(createSaleDto, user.sub);
  }

  @Get()
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
