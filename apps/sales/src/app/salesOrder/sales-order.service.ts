import { handleRpcException } from '@inventory-system/constants';
import { CreateSalesOrderDto, FindSalesOrdersDto } from '@inventory-system/dto';
import { Location, Product, SalesOrder, SalesOrderItem, Stock } from '@inventory-system/entities';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { DataSource, In, Like } from 'typeorm';

@Injectable()
export class SalesOrderService {
  constructor(private dataSource: DataSource) {}
  async create(createSalesOrderDto: CreateSalesOrderDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const productRepo = queryRunner.manager.getRepository(Product);
      const locationRepo = queryRunner.manager.getRepository(Location);
      const salesOrderRepo = queryRunner.manager.getRepository(SalesOrder);
      const salesOrderItemRepo = queryRunner.manager.getRepository(SalesOrderItem);
      const stockRepo = queryRunner.manager.getRepository(Stock);

      // 1. Validate products and locations (once)
      const productIds = [...new Set(createSalesOrderDto.items.map((item) => item.productId))];
      const locationIds = [...new Set(createSalesOrderDto.items.map((item) => item.locationId))];

      const validProducts = await productRepo.find({ where: { id: In(productIds), user: userId } });
      const validLocations = await locationRepo.find({
        where: { id: In(locationIds), user: userId },
      });

      const productMap = new Map(validProducts.map((p) => [p.id, p]));
      const locationMap = new Map(validLocations.map((l) => [l.id, l]));

      for (const item of createSalesOrderDto.items) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new RpcException({
            statusCode: 400,
            message: `Invalid product ID: ${item.productId}`,
          });
        }
        const location = locationMap.get(item.locationId);
        if (!location) {
          throw new RpcException({
            statusCode: 400,
            message: `Invalid location ID: ${item.locationId}`,
          });
        }
      }

      // 2. Fetch current stock records
      const stocks = await stockRepo.find({
        where: createSalesOrderDto.items.map((item) => ({
          product: { id: item.productId },
          location: { id: item.locationId },
          user: userId,
        })),
        relations: ['product', 'location'],
      });

      const stockMap = new Map<string, Stock>();
      stocks.forEach((stock) => {
        const key = `${stock.product.id}|${stock.location.id}`;
        stockMap.set(key, stock);
      });

      // 3. Calculate reserved quantities from existing open sales order items
      //    (all items where quantityOrdered > quantityShipped)
      const items = createSalesOrderDto.items;
      let whereClause = '';
      const parameters: any = {};

      for (let i = 0; i < items.length; i++) {
        const productParam = `product_${i}`;
        const locationParam = `location_${i}`;
        whereClause += `(item.product = :${productParam} AND item.location = :${locationParam})`;
        if (i < items.length - 1) whereClause += ' OR ';
        parameters[productParam] = items[i].productId;
        parameters[locationParam] = items[i].locationId;
      }

      const openItems = await salesOrderItemRepo
        .createQueryBuilder('item')
        .innerJoin('item.salesOrder', 'order')
        .where('order.user = :userId', { userId })
        .andWhere('item.quantityOrdered > item.quantityShipped')
        .andWhere(`(${whereClause})`, parameters)
        .getMany();

      // Filter only items that are still open (quantityOrdered > quantityShipped)
      const openItemsFiltered = openItems.filter(
        (item) => item.quantityOrdered > item.quantityShipped,
      );

      // Sum reserved quantity per (productId, locationId)
      const reservedMap = new Map<string, number>();
      for (const item of openItemsFiltered) {
        const key = `${item.product}|${item.location}`;
        const openQty = item.quantityOrdered - item.quantityShipped;
        reservedMap.set(key, (reservedMap.get(key) || 0) + openQty);
      }

      // 4. Validate stock availability considering existing reservations
      for (const item of createSalesOrderDto.items) {
        const key = `${item.productId}|${item.locationId}`;
        const stock = stockMap.get(key);
        if (!stock) {
          const productName = productMap.get(item.productId)?.name || item.productId;
          const locationName = locationMap.get(item.locationId)?.name || item.locationId;
          throw new RpcException({
            statusCode: 400,
            message: `No stock found for product "${productName}" at location "${locationName}"`,
          });
        }

        const reserved = reservedMap.get(key) || 0;
        const available = stock.quantity - reserved;
        if (available < item.quantityOrdered) {
          const productName = stock.product.name;
          const locationName = stock.location.name;
          throw new RpcException({
            statusCode: 400,
            message:
              `Insufficient available stock for product "${productName}" at location "${locationName}". ` +
              `On hand: ${stock.quantity}, Reserved: ${reserved}, Available: ${available}, Requested: ${item.quantityOrdered}`,
          });
        }
      }

      // 5. Generate order number (SO = Sales Order)
      const currentYear = new Date().getFullYear();
      const lastSo = await salesOrderRepo.findOne({
        where: { orderNumber: Like(`SO-${currentYear}-%`) },
        order: { createdAt: 'DESC' },
      });
      let nextNumber = 1;
      if (lastSo) {
        const match = lastSo.orderNumber.match(/SO-\d{4}-(\d{5})/);
        if (match) {
          nextNumber = parseInt(match[1], 10) + 1;
        }
      }
      const paddedNumber = nextNumber.toString().padStart(5, '0');
      const newOrderNumber = `SO-${currentYear}-${paddedNumber}`;

      // 6. Create sales order and items
      const salesOrder = salesOrderRepo.create({
        orderNumber: newOrderNumber,
        status: 'draft',
        requestedDeliveryDate: createSalesOrderDto.requestedDeliveryDate,
        user: userId,
        customer: createSalesOrderDto.customer,
        totalAmount: createSalesOrderDto.items.reduce(
          (sum, item) => sum + item.quantityOrdered * item.unitPrice,
          0,
        ),
      });

      salesOrder.items = createSalesOrderDto.items.map((item) =>
        salesOrderItemRepo.create({
          product: item.productId,
          location: item.locationId,
          quantityOrdered: item.quantityOrdered,
          unitPrice: item.unitPrice,
          quantityShipped: 0, // explicitly set
        }),
      );

      const result = await salesOrderRepo.save(salesOrder);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleRpcException(error, 'Failed to create sales order');
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // sales-order.service.ts
  async findAll(filters: FindSalesOrdersDto, userId: string) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        search,
        status,
        customer,
        orderDateFrom,
        orderDateTo,
        requestedDeliveryFrom,
        requestedDeliveryTo,
        minTotalAmount,
        maxTotalAmount,
      } = filters;

      const queryBuilder = this.dataSource
        .getRepository(SalesOrder)
        .createQueryBuilder('so')
        .where('so.user = :userId', { userId });

      // Apply filters
      if (search) {
        queryBuilder.andWhere('(so.orderNumber ILIKE :search OR so.customer ILIKE :search)', {
          search: `%${search}%`,
        });
      }
      if (status) {
        queryBuilder.andWhere('so.status = :status', { status });
      }
      if (customer) {
        queryBuilder.andWhere('so.customer ILIKE :customer', { customer: `%${customer}%` });
      }
      if (orderDateFrom) {
        queryBuilder.andWhere('so.orderDate >= :orderDateFrom', { orderDateFrom });
      }
      if (orderDateTo) {
        queryBuilder.andWhere('so.orderDate <= :orderDateTo', { orderDateTo });
      }
      if (requestedDeliveryFrom) {
        queryBuilder.andWhere('so.requestedDeliveryDate >= :requestedDeliveryFrom', {
          requestedDeliveryFrom,
        });
      }
      if (requestedDeliveryTo) {
        queryBuilder.andWhere('so.requestedDeliveryDate <= :requestedDeliveryTo', {
          requestedDeliveryTo,
        });
      }
      if (minTotalAmount !== undefined) {
        queryBuilder.andWhere('so.totalAmount >= :minTotalAmount', { minTotalAmount });
      }
      if (maxTotalAmount !== undefined) {
        queryBuilder.andWhere('so.totalAmount <= :maxTotalAmount', { maxTotalAmount });
      }

      const [data, total] = await queryBuilder
        .orderBy(`so.${sortBy}`, sortOrder)
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      handleRpcException(error, 'Database error while fetching sales orders');
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const salesOrder = await this.dataSource.getRepository(SalesOrder).findOne({
        where: { id, user: userId },
        relations: ['items'],
      });
      if (!salesOrder)
        throw new RpcException({ statusCode: 404, message: 'Sales Order not found' });
      return salesOrder;
    } catch (error) {
      handleRpcException(error, 'Database error while fetching sales order');
    }
  }

  // async findAll(userId: string) {
  //   try {
  //     const salesOrders = await this.dataSource.getRepository(SalesOrder).find({
  //       where: {
  //         user: userId
  //       }, relations: ['items']
  //     });
  //     if (!salesOrders) {
  //       throw new RpcException({
  //         statusCode: 404,
  //         message: "Sales Orders not found",
  //       })
  //     }
  //     return salesOrders;
  //   } catch (error) {
  //     handleRpcException(error, "Database error while getting sales orders");
  //   }
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} salesOrder`;
  // }

  // update(id: number, updateSalesOrderDto: UpdateSalesOrderDto) {
  //   return `This action updates a #${id} salesOrder`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} salesOrder`;
  // }
}
