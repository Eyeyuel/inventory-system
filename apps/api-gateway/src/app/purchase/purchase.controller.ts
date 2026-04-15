import { Body, Controller, Post } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseOrderDto } from '@inventory-system/dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) { }

  @Post()
  create(@Body() createPurchaseDto: CreatePurchaseOrderDto, @CurrentUser() user: { sub: string }) {
    return this.purchaseService.create(createPurchaseDto, user.sub);
  }

  // @Get()
  // findAll() {
  //   return this.purchaseService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.purchaseService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePurchaseDto: UpdatePurchaseDto) {
  //   return this.purchaseService.update(+id, updatePurchaseDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.purchaseService.remove(+id);
  // }
}
