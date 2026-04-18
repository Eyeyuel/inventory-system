import { handleRpcException } from '@inventory-system/constants';
import { CreatePurchaseOrderDto } from '@inventory-system/dto';
import { Location, Product, PurchaseOrder, PurchaseOrderItem } from '@inventory-system/entities';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { DataSource, In, Like } from 'typeorm';


@Injectable()
export class PurchaseOrderService {
  constructor(private dataSource: DataSource) { }

  async create(createPurchaseOrderDto: CreatePurchaseOrderDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const productRepo = queryRunner.manager.getRepository(Product);
      const locationRepo = queryRunner.manager.getRepository(Location);
      // const stockRepo = queryRunner.manager.getRepository(Stock);
      // const movementRepo = queryRunner.manager.getRepository(StockMovement);
      const purchaseOrderRepo = queryRunner.manager.getRepository(PurchaseOrder);
      const purchaseOrderItemRepo = queryRunner.manager.getRepository(PurchaseOrderItem);

      // Validate product and location IDs
      const productIds = createPurchaseOrderDto.items.map(item => item.productId);
      const locationIds = createPurchaseOrderDto.items.map(item => item.locationId);

      const validProducts = await productRepo.find({ where: { id: In(productIds), user: userId } });
      const validLocations = await locationRepo.find({ where: { id: In(locationIds), user: userId } });

      for (const item of createPurchaseOrderDto.items) {
        if (!validProducts.find(p => p.id === item.productId)) throw new RpcException({ statusCode: 400, message: `Invalid product ID: ${item.productId}` });
        if (!validLocations.find(l => l.id === item.locationId)) throw new RpcException({ statusCode: 400, message: `Invalid location ID: ${item.locationId}` });
      }
      // creating order number
      const currentYear = new Date().getFullYear();
      const lastPo = await purchaseOrderRepo.findOne({
        where: { orderNumber: Like(`PO-${currentYear}-%`) },
        order: { createdAt: 'DESC' },
      });
      let nextNumber = 1;
      if (lastPo) {
        const match = lastPo.orderNumber.match(/PO-\d{4}-(\d{5})/);
        if (match) {
          nextNumber = parseInt(match[1], 10) + 1;
        }
      }
      const paddedNumber = nextNumber.toString().padStart(5, '0');
      const newOrderNumber = `PO-${currentYear}-${paddedNumber}`;
      // Create purchase order
      const purchaseOrder = purchaseOrderRepo.create({
        orderNumber: newOrderNumber,
        status: 'draft',
        expectedDeliveryDate: createPurchaseOrderDto.expectedDeliveryDate,
        user: userId,
        supplier: createPurchaseOrderDto.supplier,
        totalCost: createPurchaseOrderDto.items.reduce((sum, item) => sum + (item.quantityOrdered * item.unitCost), 0),
      });
      // Create items and attach to the order
      purchaseOrder.items = createPurchaseOrderDto.items.map(item => {
        return purchaseOrderItemRepo.create({
          product: item.productId,
          location: item.locationId,
          quantityOrdered: item.quantityOrdered,
          unitCost: item.unitCost,
        });
      });

      const result = await purchaseOrderRepo.save(purchaseOrder);
      await queryRunner.commitTransaction();
      return result;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleRpcException(error, 'Failed to create purchase order');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId: string) {
    try {
      const purchaseOrders = await this.dataSource.getRepository(PurchaseOrder).find({
        where: {
          user: userId
        }, relations: ['items']
      });
      if (!purchaseOrders) {
        throw new RpcException({
          statusCode: 404,
          message: "Purchase Orders not found",
        })
      }
      return purchaseOrders;
    } catch (error) {
      handleRpcException(error, "Database error while getting purchase orders");
    }
  }

}
