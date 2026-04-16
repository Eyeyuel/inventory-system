import { handleRpcException } from '@inventory-system/constants';
import { AdjustStockDto, GetStockMovementsQueryDto, GetStocksQueryDto, ReceiveStockDto, ShipStockDto, StockMovementResponseDto, StockMovementSummaryDto, TransferStockDto } from '@inventory-system/dto';
import { Location, Product, PurchaseOrder, PurchaseOrderItem, Stock, StockMovement } from '@inventory-system/entities';
import { StockMovementReasonsTypeForAdjust, StockMovementType } from '@inventory-system/types';
import { BadRequestException, HttpCode, HttpException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Between, DataSource, FindOptionsWhere } from 'typeorm';

@Injectable()
export class StockService {
  constructor(private dataSource: DataSource) { }

  async getStocks(userId: string, filters: GetStocksQueryDto) {
    const where: any = { user: userId };
    if (filters.locationId) where.location = { id: filters.locationId };
    if (filters.productId) where.product = { id: filters.productId };

    try {
      const stocks = await this.dataSource.getRepository(Stock).find({ where, relations: ['location', 'product'] });
      if (stocks.length === 0) {
        throw new RpcException({ statusCode: 404, message: 'No stocks found' });
      }
      return stocks;
    } catch (error) {
      handleRpcException(error, "Database error while getting stocks");
    }
  }

  async findAllStockMovements(filters: GetStockMovementsQueryDto, userId: string): Promise<StockMovementResponseDto> {
    const { stockId, type, fromDate, toDate, referenceId, page = 1, limit = 2 } = filters;

    // Build where clause
    const where: FindOptionsWhere<StockMovement> = {};

    if (stockId) where.stock = { id: stockId };
    if (type) where.type = type;
    if (userId) where.user = userId;
    if (referenceId) where.referenceId = referenceId;

    // Date range
    if (fromDate || toDate) {
      const start = fromDate ? new Date(fromDate) : new Date(0);
      const end = toDate ? new Date(toDate) : new Date();
      where.createdAt = Between(start, end);
    }

    const [entities, total] = await this.dataSource
      .getRepository(StockMovement)
      .findAndCount({ where, relations: ['stock', 'stock.location', 'stock.product'], order: { createdAt: 'DESC' }, take: limit, skip: (page - 1) * limit });

    // Map entities to summary DTO
    const data: StockMovementSummaryDto[] = entities.map(entity => ({
      id: entity.id,
      type: entity.type,
      quantityChange: entity.quantityChange,
      createdAt: entity.createdAt,
      reason: entity.reason,
      description: entity.description,
      user: entity.user,
      stock: {
        id: entity.stock.id,
        quantity: entity.stock.quantity,
        product: {
          id: entity.stock.product.id,
          name: entity.stock.product.name,
        },
        location: {
          id: entity.stock.location?.id ?? '',
          name: entity.stock.location?.name ?? '',
        },
      },
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async reciveStock(reciveStockDto: ReceiveStockDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const stockRepo = queryRunner.manager.getRepository(Stock);
      const movementRepo = queryRunner.manager.getRepository(StockMovement);
      const productRepo = queryRunner.manager.getRepository(Product);
      const locationRepo = queryRunner.manager.getRepository(Location);
      const purchaseOrderRepo = queryRunner.manager.getRepository(PurchaseOrder);
      const purchaseOrderItemRepo = queryRunner.manager.getRepository(PurchaseOrderItem);

      // 1. Validate product ownership
      const product = await productRepo.findOneBy({ id: reciveStockDto.productId, user: userId });
      if (!product) {
        throw new RpcException({ statusCode: 400, message: 'Product not found or not owned by user' });
      }

      // 2. Validate location ownership
      const location = await locationRepo.findOneBy({ id: reciveStockDto.locationId, user: userId });
      if (!location) {
        throw new RpcException({ statusCode: 400, message: 'Location not found or not owned by user' });
      }

      // 3. Find or create stock record (TypeScript-safe)
      const existingStock = await stockRepo.findOne({
        where: {
          product: { id: reciveStockDto.productId },
          location: { id: reciveStockDto.locationId }
        },
        relations: ['product', 'location']
      });

      const stock = existingStock ?? stockRepo.create({
        product: { id: reciveStockDto.productId },
        location: { id: reciveStockDto.locationId },
        quantity: 0,
        user: userId,
      });
      const isNewStock = !existingStock;

      if (reciveStockDto.reasonCode === 'opening_stock' && !isNewStock) {
        throw new RpcException({ statusCode: 400, message: 'Opening stock can only be set on the first movement for a product-location' });
      }

      // this is for Purchase Order receiving
      if (reciveStockDto.reasonCode === 'purchase_receipt') {

        if (reciveStockDto.purchaseOrderItemId) {
          // maybe get the whole purchase order and cascade the changes
          const poItem = await purchaseOrderItemRepo.findOne({
            where: { id: reciveStockDto.purchaseOrderItemId },
            relations: { purchaseOrder: true }, select: { purchaseOrder: { id: true } }
          });
          if (!poItem) {
            throw new RpcException({ statusCode: 400, message: 'Purchase order item not found' });
          }

          const beforeQty = stock.quantity;
          const newQty = poItem.quantityReceived + reciveStockDto.quantity;
          if (poItem.quantityOrdered === poItem.quantityReceived) {
            throw new HttpException({
              "message": "Purchase order item has already been fully received. Cannot receive more.",
            }, 400);
          }
          if (newQty > poItem.quantityOrdered) {
            throw new BadRequestException('Quantuty recived is more then orderd quanity.');
          }

          // save stock with the correct stock quantity
          stock.quantity = stock.quantity + reciveStockDto.quantity;
          stock.user = userId;
          const stockResponse = await stockRepo.save(stock);


          // update the POI with the new quantity
          const updatedPOI = purchaseOrderItemRepo.create({
            ...poItem, quantityReceived: poItem.quantityReceived + reciveStockDto.quantity
          })
          const POIResponse = await purchaseOrderItemRepo.save(updatedPOI)

          const mainPO = await purchaseOrderRepo.findOneBy({ id: poItem.purchaseOrder.id });
          if (mainPO) {
            // check if all items are received and update the PO status to received
            const allItems = await purchaseOrderItemRepo.findBy({ purchaseOrder: { id: mainPO.id } });
            const allReceived = allItems.every(item => item.quantityOrdered === item.quantityReceived);
            if (allReceived) {
              mainPO.status = 'received';
              mainPO.receivedDate = new Date();
              await purchaseOrderRepo.save(mainPO);
            }
          }

          const movement = movementRepo.create({
            type: StockMovementType.RECEIVE,
            quantityChange: reciveStockDto.quantity,
            beforeQuantity: beforeQty,
            afterQuantity: stock.quantity,
            referenceId: reciveStockDto.referenceId,
            reason: reciveStockDto.reasonCode,
            user: userId,
            stock,
          });
          const movementresponse = await movementRepo.save(movement);

          await queryRunner.commitTransaction();

          return { POIResponse, stockResponse, movementresponse };
        } else {
          throw new RpcException({ statusCode: 400, message: 'purchaseOrderItemId is needed to update purchase order' });
        }
      }

      const beforeQty = stock.quantity;
      const newQty = beforeQty + reciveStockDto.quantity;
      if (newQty < 0) {
        throw new BadRequestException(`Insufficient stock at ${stock.location?.name || 'location'}`);
      }

      stock.quantity = newQty;
      stock.user = userId;
      await stockRepo.save(stock);

      const movement = movementRepo.create({
        type: StockMovementType.RECEIVE,
        quantityChange: reciveStockDto.quantity,
        beforeQuantity: beforeQty,
        afterQuantity: newQty,
        referenceId: reciveStockDto.referenceId,
        reason: reciveStockDto.reasonCode,
        user: userId,
        stock,
      });
      await movementRepo.save(movement);

      await queryRunner.commitTransaction();
      return { stock, movement };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      //     // Error handling as per your existing logic
      handleRpcException(error, "Database error while receiving stock");
    } finally {
      await queryRunner.release();
    }
  }

  async ship(shipStockDto: ShipStockDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const stockRepo = queryRunner.manager.getRepository(Stock);
      const movementRepo = queryRunner.manager.getRepository(StockMovement);
      const productRepo = queryRunner.manager.getRepository(Product);
      const locationRepo = queryRunner.manager.getRepository(Location);

      // 1. Validate product ownership
      const product = await productRepo.findOneBy({ id: shipStockDto.productId, user: userId });
      if (!product) {
        throw new RpcException({ statusCode: 400, message: 'Product not found or not owned by user' });
      }

      // 2. Validate location ownership
      const location = await locationRepo.findOneBy({ id: shipStockDto.locationId, user: userId });
      if (!location) {
        throw new RpcException({ statusCode: 400, message: 'Location not found or not owned by user' });
      }

      // 3. Find if the stock exists
      const stock = await stockRepo.findOne({
        where: {
          product: { id: shipStockDto.productId },
          location: { id: shipStockDto.locationId }
        },
        relations: ['product', 'location']
      });

      if (!stock) {
        throw new RpcException({ statusCode: 400, message: 'Stock not found' });
      }

      // const stock = existingStock ?? stockRepo.create({
      //   product: { id: shipStockDto.productId },
      //   location: { id: shipStockDto.locationId },
      //   quantity: 0,
      //   user: userId,
      // });
      // const isNewStock = !existingStock;

      // if (shipStockDto.reasonCode === 'opening_stock' && !isNewStock) {
      //   throw new RpcException({ statusCode: 400, message: 'Opening stock can only be set on the first movement for a product-location' });
      // }

      const beforeQty = stock.quantity;
      const newQty = beforeQty - shipStockDto.quantity;
      if (newQty < 0) {
        throw new BadRequestException(`Insufficient stock at ${stock.location?.name || 'location'}`);
      }

      stock.quantity = newQty;
      // stock.user = userId;
      await stockRepo.save(stock);

      const movement = movementRepo.create({
        type: StockMovementType.SHIP,
        quantityChange: shipStockDto.quantity,
        beforeQuantity: beforeQty,
        afterQuantity: newQty,
        referenceId: shipStockDto.referenceId,
        reason: shipStockDto.reasonCode,
        user: userId,
        stock,
      });
      await movementRepo.save(movement);

      await queryRunner.commitTransaction();
      return { stock, movement };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      //     // Error handling as per your existing logic
      handleRpcException(error, "Database error while receiving stock");
    } finally {
      await queryRunner.release();
    }
  }

  async transfer(transferStockDto: TransferStockDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const stockRepo = queryRunner.manager.getRepository(Stock);
      const movementRepo = queryRunner.manager.getRepository(StockMovement);
      const productRepo = queryRunner.manager.getRepository(Product);
      const locationRepo = queryRunner.manager.getRepository(Location);

      // 1. Validate product ownership
      const product = await productRepo.findOneBy({ id: transferStockDto.productId, user: userId });
      if (!product) {
        throw new RpcException({ statusCode: 400, message: 'Product not found or not owned by user' });
      }

      // 2. Validate both location ownership
      const fromLocation = await locationRepo.findOneBy({ id: transferStockDto.fromLocationId, user: userId });

      const toLocation = await locationRepo.findOneBy({ id: transferStockDto.toLocationId, user: userId });

      if (!fromLocation || !toLocation) {
        throw new RpcException({ statusCode: 400, message: 'Verify that both fromLocation and toLocation belog to the user.' });
      }

      // 3. Find if the stock exists
      const stock = await stockRepo.findOne({
        where: {
          product: { id: transferStockDto.productId },
          location: { id: transferStockDto.fromLocationId }
        },
        relations: ['product', 'location']
      });

      if (!stock) {
        throw new RpcException({ statusCode: 400, message: 'Stock not found' });
      }

      const beforeQty = stock.quantity;
      const newQty = beforeQty - transferStockDto.quantity;
      if (newQty < 0) {
        throw new BadRequestException(`Insufficient stock at ${stock.location?.name || 'location'}`);
      }

      stock.quantity = newQty;
      // save the stock with reduced qunaity
      await stockRepo.save(stock);

      // check if the stock in the new location exists first and if does't create and save the moved stock in the new location
      const existingStock = await stockRepo.findOne({
        where: {
          product: { id: transferStockDto.productId },
          location: { id: transferStockDto.toLocationId }
        },
        // relations: ['product', 'location']
      });

      const newStock = existingStock ?? stockRepo.create({
        product: { id: transferStockDto.productId },
        location: { id: transferStockDto.toLocationId },
        quantity: 0,
        user: userId,
      })
      newStock.quantity = newStock.quantity + transferStockDto.quantity;
      await stockRepo.save(newStock);

      // create sotck movement
      const movement = movementRepo.create({
        type: StockMovementType.TRANSFER,
        quantityChange: transferStockDto.quantity,
        beforeQuantity: beforeQty,
        afterQuantity: newQty,
        // referenceId: transferStockDto,
        reason: transferStockDto.reason ?? "transfer between locations.",
        description: transferStockDto.description,
        user: userId,
        stock,
      });
      await movementRepo.save(movement);

      await queryRunner.commitTransaction();
      return { stock, newStock, movement };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      //     // Error handling as per your existing logic
      handleRpcException(error, "Database error while receiving stock");
    } finally {
      await queryRunner.release();
    }
  }

  async adjust(adjustStockDto: AdjustStockDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const stockRepo = queryRunner.manager.getRepository(Stock);
      const movementRepo = queryRunner.manager.getRepository(StockMovement);
      const productRepo = queryRunner.manager.getRepository(Product);
      const locationRepo = queryRunner.manager.getRepository(Location);

      // 1. Validate product ownership
      const product = await productRepo.findOneBy({ id: adjustStockDto.productId, user: userId });
      if (!product) {
        throw new RpcException({ statusCode: 400, message: 'Product not found or not owned by user' });
      }

      // 2. Validate location ownership
      const location = await locationRepo.findOneBy({ id: adjustStockDto.locationId, user: userId });
      if (!location) {
        throw new RpcException({ statusCode: 400, message: 'Location not found or not owned by user' });
      }

      // 3. Find or create stock record (TypeScript-safe)
      const stock = await stockRepo.findOne({
        where: {
          product: { id: adjustStockDto.productId },
          location: { id: adjustStockDto.locationId }
        },
        // relations: ['product', 'location']
      });

      if (!stock) throw new RpcException({ statusCode: 400, message: 'Stock not found' })

      // determine whether to add, reduce or set the quntity
      const beforeQty = stock.quantity;
      let newQty = 0;
      // Validation based on reason code
      switch (adjustStockDto.reasonCode) {
        case StockMovementReasonsTypeForAdjust.DAMAGE:
        case StockMovementReasonsTypeForAdjust.LOSS:
          if (adjustStockDto.quantityChange >= 0) {
            throw new RpcException({
              statusCode: 400,
              message: `For reason code "${adjustStockDto.reasonCode}", quantityChange must be negative (decrease stock)`
            });
          }
          newQty = beforeQty + adjustStockDto.quantityChange; // quantityChange is negative → subtraction
          break;

        case StockMovementReasonsTypeForAdjust.FOUND:
          if (adjustStockDto.quantityChange <= 0) {
            throw new RpcException({
              statusCode: 400,
              message: `For reason code "found", quantityChange must be positive (increase stock)`
            });
          }
          newQty = beforeQty + adjustStockDto.quantityChange;
          break;

        case StockMovementReasonsTypeForAdjust.CORRECTION:
          // Can be positive or negative, no restriction
          newQty = beforeQty + adjustStockDto.quantityChange;
          break;

        case StockMovementReasonsTypeForAdjust.CYCLE_COUNT:
          if (adjustStockDto.quantityChange < 0) {
            throw new RpcException({
              statusCode: 400,
              message: `For reason code "cycle_count", quantityChange must be non-negative (absolute new quantity)`
            });
          }
          newQty = adjustStockDto.quantityChange; // absolute replacement
          break;

        default:
          throw new RpcException({
            statusCode: 400,
            message: `Invalid reason code: ${adjustStockDto.reasonCode}. Allowed: damage, loss, found, correction, cycle_count`
          });
      }
      // Final validation: stock cannot be negative
      if (newQty < 0) {
        throw new RpcException({
          statusCode: 400,
          message: `Insufficient stock. Current: ${beforeQty}, attempted change would result in ${newQty}`
        });
      }

      // const newQty = beforeQty + adjustStockDto.quantityChange;

      stock.quantity = newQty;
      stock.user = userId;
      await stockRepo.save(stock);

      const movement = movementRepo.create({
        type: StockMovementType.ADJUST,
        quantityChange: adjustStockDto.quantityChange,
        beforeQuantity: beforeQty,
        afterQuantity: newQty,
        referenceId: adjustStockDto.referenceId,
        reason: adjustStockDto.reasonCode,
        description: adjustStockDto.description,
        user: userId,
        stock,
      });
      await movementRepo.save(movement);

      await queryRunner.commitTransaction();
      return { stock, movement };
    }

    catch (error) {
      await queryRunner.rollbackTransaction();
      //     // Error handling as per your existing logic
      handleRpcException(error, "Database error while receiving stock");
    } finally {
      await queryRunner.release();
    }
  }

}