import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseOrderDto, PurchaseOrderResponseDto } from '@inventory-system/dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new purchase order' })
  @ApiCreatedResponse({ description: 'Purchase order created', type: PurchaseOrderResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid purchase order data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  create(@Body() createPurchaseDto: CreatePurchaseOrderDto, @CurrentUser() user: { sub: string }) {
    return this.purchaseService.create(createPurchaseDto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List all purchse orders' })
  @ApiOkResponse({ description: 'Purchase orders retrieved', type: [PurchaseOrderResponseDto] })
  @ApiNotFoundResponse({ description: 'No purchase orders found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll(@CurrentUser() user: { sub: string }) {
    return this.purchaseService.findAll(user.sub);
  }

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
