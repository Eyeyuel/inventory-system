import { SALES_ORDER_CMD } from '@inventory-system/constants';
import { CreateSalesOrderDto, FindSalesOrdersDto } from '@inventory-system/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SalesService {
  constructor(@Inject('SALES_ORDER_SERVICE') private readonly salesOrderClient: ClientProxy) {}
  create(createSalesOrderDto: CreateSalesOrderDto, userId: string) {
    return this.salesOrderClient.send(SALES_ORDER_CMD.CREATE, { createSalesOrderDto, userId });
  }

  findAll(filters: FindSalesOrdersDto, userId: string) {
    return this.salesOrderClient.send(SALES_ORDER_CMD.FIND, { filters, userId });
  }

  findOne(id: string, userId: string) {
    return this.salesOrderClient.send(SALES_ORDER_CMD.FIND_ONE, { id, userId });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} sale`;
  // }

  // update(id: number, updateSaleDto: UpdateSaleDto) {
  //   return `This action updates a #${id} sale`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} sale`;
  // }
}
