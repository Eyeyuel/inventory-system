import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PurchaseOrderService } from './purchase-order.service';
import { CreatePurchaseOrderDto, FindPurchaseOrdersDto } from '@inventory-system/dto';
import { PURCHASE_ORDER_CMD } from '@inventory-system/constants';

@Controller()
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @MessagePattern(PURCHASE_ORDER_CMD.CREATE)
  create(@Payload() payload: { createPurchaseOrderDto: CreatePurchaseOrderDto; userId: string }) {
    return this.purchaseOrderService.create(payload.createPurchaseOrderDto, payload.userId);
  }

  @MessagePattern(PURCHASE_ORDER_CMD.FIND)
  findAll(@Payload() payload: { filters: FindPurchaseOrdersDto; userId: string }) {
    return this.purchaseOrderService.findAll(payload.filters, payload.userId);
  }

  @MessagePattern(PURCHASE_ORDER_CMD.FIND_ONE)
  findOne(@Payload() payload: { id: string; userId: string }) {
    return this.purchaseOrderService.findOne(payload.id, payload.userId);
  }

  // @MessagePattern('updatePurchaseOrder')
  // update(@Payload() updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
  //   return this.purchaseOrderService.update(updatePurchaseOrderDto.id, updatePurchaseOrderDto);
  // }

  // @MessagePattern('removePurchaseOrder')
  // remove(@Payload() id: number) {
  //   return this.purchaseOrderService.remove(id);
  // }
}
