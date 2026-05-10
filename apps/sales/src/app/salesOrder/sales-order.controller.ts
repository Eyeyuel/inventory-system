import { Controller } from '@nestjs/common';
import { SalesOrderService } from './sales-order.service';
import { MessagePattern } from '@nestjs/microservices';
import { SALES_ORDER_CMD } from '@inventory-system/constants';
import { CreateSalesOrderDto, FindSalesOrdersDto } from '@inventory-system/dto';
import { Payload } from '@nestjs/microservices';

@Controller()
export class SalesOrderController {
  constructor(private readonly salesOrderService: SalesOrderService) {}

  @MessagePattern(SALES_ORDER_CMD.CREATE)
  create(@Payload() payload: { createSalesOrderDto: CreateSalesOrderDto; userId: string }) {
    return this.salesOrderService.create(payload.createSalesOrderDto, payload.userId);
  }

  @MessagePattern(SALES_ORDER_CMD.FIND)
  findAll(@Payload() payload: { filters: FindSalesOrdersDto; userId: string }) {
    return this.salesOrderService.findAll(payload.filters, payload.userId);
  }

  @MessagePattern(SALES_ORDER_CMD.FIND_ONE)
  findOne(@Payload() payload: { id: string; userId: string }) {
    return this.salesOrderService.findOne(payload.id, payload.userId);
  }

  // @MessagePattern('findOneSalesOrder')
  // findOne(@Payload() id: number) {
  //   return this.salesOrderService.findOne(id);
  // }

  // @MessagePattern('updateSalesOrder')
  // update(@Payload() updateSalesOrderDto: UpdateSalesOrderDto) {
  //   return this.salesOrderService.update(updateSalesOrderDto.id, updateSalesOrderDto);
  // }

  // @MessagePattern('removeSalesOrder')
  // remove(@Payload() id: number) {
  //   return this.salesOrderService.remove(id);
  // }
}
