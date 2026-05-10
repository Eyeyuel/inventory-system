import { PURCHASE_ORDER_CMD } from '@inventory-system/constants';
import { CreatePurchaseOrderDto, FindPurchaseOrdersDto } from '@inventory-system/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PurchaseService {
  constructor(
    @Inject('PURCHASE_ORDER_SERVICE') private readonly purchaseOrderClient: ClientProxy,
  ) {}
  create(createPurchaseOrderDto: CreatePurchaseOrderDto, userId: string) {
    return this.purchaseOrderClient.send(PURCHASE_ORDER_CMD.CREATE, {
      createPurchaseOrderDto,
      userId,
    });
  }

  findAll(filters: FindPurchaseOrdersDto, userId: string) {
    return this.purchaseOrderClient.send(PURCHASE_ORDER_CMD.FIND, { filters, userId });
  }

  findOne(id: string, userId: string) {
    return this.purchaseOrderClient.send(PURCHASE_ORDER_CMD.FIND_ONE, { id, userId });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} purchase`;
  // }

  // update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
  //   return `This action updates a #${id} purchase`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} purchase`;
  // }
}
