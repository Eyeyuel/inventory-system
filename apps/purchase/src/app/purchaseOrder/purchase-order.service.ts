import { CreatePurchaseOrderDto } from '@inventory-system/dto';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Stock, StockMovement, Product, Location } from '@inventory-system/entities';
import { handleRpcException } from '@inventory-system/constants';

@Injectable()
export class PurchaseOrderService {
  constructor(private dataSource: DataSource) { }

  async create(createPurchaseOrderDto: CreatePurchaseOrderDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const stockRepo = queryRunner.manager.getRepository(Stock);
      const movementRepo = queryRunner.manager.getRepository(StockMovement);
      const productRepo = queryRunner.manager.getRepository(Product);
      const locationRepo = queryRunner.manager.getRepository(Location);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleRpcException(error, 'Failed to create purchase order');
    } finally {
      await queryRunner.release();
    }
  }

  // findAll() {
  //   return `This action returns all purchaseOrder`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} purchaseOrder`;
  // }

  // update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
  //   return `This action updates a #${id} purchaseOrder`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} purchaseOrder`;
  // }
}
