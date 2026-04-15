import { Controller } from '@nestjs/common';
import { PurchaseOrderItemService } from './purchase-order-item.service';

@Controller()
export class PurchaseOrderItemController {
  constructor(private readonly purchaseOrderItemService: PurchaseOrderItemService) { }

  // @MessagePattern('createPurchaseOrderItem')
  // create(@Payload() createPurchaseOrderItemDto: CreatePurchaseOrderItemDto) {
  //   return this.purchaseOrderItemService.create(createPurchaseOrderItemDto);
  // }

  // @MessagePattern('findAllPurchaseOrderItem')
  // findAll() {
  //   return this.purchaseOrderItemService.findAll();
  // }

  // @MessagePattern('findOnePurchaseOrderItem')
  // findOne(@Payload() id: number) {
  //   return this.purchaseOrderItemService.findOne(id);
  // }

  // @MessagePattern('updatePurchaseOrderItem')
  // update(@Payload() updatePurchaseOrderItemDto: UpdatePurchaseOrderItemDto) {
  //   return this.purchaseOrderItemService.update(updatePurchaseOrderItemDto.id, updatePurchaseOrderItemDto);
  // }

  // @MessagePattern('removePurchaseOrderItem')
  // remove(@Payload() id: number) {
  //   return this.purchaseOrderItemService.remove(id);
  // }
}
