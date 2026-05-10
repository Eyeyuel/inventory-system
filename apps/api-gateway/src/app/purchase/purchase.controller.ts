import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import {
  CreatePurchaseOrderDto,
  FindPurchaseOrdersDto,
  PaginatedPurchaseOrderResponseDto,
  PurchaseOrderResponseDto,
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
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Throttle({ [THROTTLE_PRESETS.purchase.name]: THROTTLE_PRESETS.purchase })
  @Post()
  @ApiOperation({ summary: 'Create a new purchase order' })
  @ApiCreatedResponse({ description: 'Purchase order created', type: PurchaseOrderResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid purchase order data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  create(@Body() createPurchaseDto: CreatePurchaseOrderDto, @CurrentUser() user: { sub: string }) {
    return this.purchaseService.create(createPurchaseDto, user.sub);
  }

  @Throttle({ [THROTTLE_PRESETS.purchase.name]: THROTTLE_PRESETS.purchase })
  @Get()
  @ApiOperation({ summary: 'List all purchse orders' })
  @ApiOkResponse({
    description: 'Purchase orders retrieved',
    type: PaginatedPurchaseOrderResponseDto,
  })
  @ApiNotFoundResponse({ description: 'No purchase orders found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll(@Query() filters: FindPurchaseOrdersDto, @CurrentUser() user: { sub: string }) {
    return this.purchaseService.findAll(filters, user.sub);
  }

  @Throttle({ [THROTTLE_PRESETS.purchase.name]: THROTTLE_PRESETS.purchase })
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific purchase order' })
  @ApiOkResponse({
    description: 'Purchase order retrieved',
    type: PurchaseOrderResponseDto,
  })
  @ApiNotFoundResponse({ description: 'No purchase orders found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findOne(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.purchaseService.findOne(id, user.sub);
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
