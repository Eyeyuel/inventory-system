import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { AdjustStockDto, GetStocksQueryDto, ReceiveStockDto, ShipStockDto, TransferStockDto } from '@inventory-system/dto';
import { Stock } from '../stock/entities/stock.entity';
import { StockMovement } from '../stockMovement/entities/stock-movement.entity';
import { RpcException } from '@nestjs/microservices';
import { Product } from '../product/entities/product.entity';
import { Location } from '../location/entities/location.entity';
import { handleRpcException } from '@inventory-system/constants';
import { StockMovementReasonsTypeForAdjust, StockMovementType } from '@inventory-system/types';

@Injectable()
export class StockService {
  constructor(private dataSource: DataSource) { }

  /**
   * Process a single stock movement (IN/OUT/ADJUSTMENT)
   * @param dto - movement details
   * @param userId - user performing the action
   */



  // async createStock(dto: CreateMovementDto, userId: string) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const stockRepo = queryRunner.manager.getRepository(Stock);
  //     const movementRepo = queryRunner.manager.getRepository(StockMovement);
  //     const productRepo = queryRunner.manager.getRepository(Product);
  //     const locationRepo = queryRunner.manager.getRepository(Location);

  //     // 1. Validate product ownership
  //     const product = await productRepo.findOneBy({ id: dto.productId, user: userId });
  //     if (!product) {
  //       throw new RpcException({ statusCode: 400, message: 'Product not found or not owned by user' });
  //     }

  //     // 2. Validate location ownership
  //     const location = await locationRepo.findOneBy({ id: dto.locationId, user: userId });
  //     if (!location) {
  //       throw new RpcException({ statusCode: 400, message: 'Location not found or not owned by user' });
  //     }

  //     // 3. Find or create stock record (TypeScript-safe)
  //     const existingStock = await stockRepo.findOne({
  //       where: {
  //         product: { id: dto.productId },
  //         location: { id: dto.locationId }
  //       },
  //       relations: ['product', 'location']
  //     });

  //     const stock = existingStock ?? stockRepo.create({
  //       product: { id: dto.productId },
  //       location: { id: dto.locationId },
  //       quantity: 0,
  //       user: userId,
  //     });
  //     const isNewStock = !existingStock;

  //     // --- VALIDATION BLOCK ---
  //     const allowedTypes = [
  //       StockMovementType.OPENING_STOCK,
  //       StockMovementType.RECEIPT,
  //       StockMovementType.SHIPMENT,
  //       StockMovementType.ADJUSTMENT,
  //       StockMovementType.RETURN,
  //     ];
  //     if (!allowedTypes.includes(dto.type)) {
  //       throw new RpcException({ statusCode: 400, message: 'Invalid movement type for this endpoint' });
  //     }

  //     if (dto.type === StockMovementType.OPENING_STOCK || dto.type === StockMovementType.RECEIPT) {
  //       if (dto.quantityChange <= 0) {
  //         throw new RpcException({ statusCode: 400, message: `${dto.type} must have a positive quantity change` });
  //       }
  //     } else if (dto.type === StockMovementType.SHIPMENT) {
  //       if (dto.quantityChange >= 0) {
  //         throw new RpcException({ statusCode: 400, message: 'Shipment must have a negative quantity change' });
  //       }
  //     } else if (dto.type === StockMovementType.RETURN) {
  //       if (dto.quantityChange <= 0) {
  //         throw new RpcException({ statusCode: 400, message: 'Return must have a positive quantity change' });
  //       }
  //     }

  //     if (dto.type === StockMovementType.OPENING_STOCK && !isNewStock) {
  //       throw new RpcException({ statusCode: 400, message: 'Opening stock can only be set on the first movement for a product-location' });
  //     }
  //     // --- END VALIDATION ---

  //     const beforeQty = stock.quantity;
  //     const newQty = beforeQty + dto.quantityChange;
  //     if (newQty < 0) {
  //       throw new BadRequestException(`Insufficient stock at ${stock.location?.name || 'location'}`);
  //     }

  //     stock.quantity = newQty;
  //     stock.user = userId;
  //     await stockRepo.save(stock);

  //     const movement = movementRepo.create({
  //       type: dto.type,
  //       quantityChange: dto.quantityChange,
  //       beforeQuantity: beforeQty,
  //       afterQuantity: newQty,
  //       referenceId: dto.referenceId,
  //       reason: dto.reason,
  //       user: userId,
  //       stock,
  //     });
  //     await movementRepo.save(movement);

  //     await queryRunner.commitTransaction();
  //     return { stock, movement };
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     // Error handling as per your existing logic
  //     if (error instanceof Error) {
  //       throw new RpcException({ statusCode: 400, message: error.message });
  //     }
  //     if (error instanceof RpcException) throw error;
  //     throw new RpcException({ statusCode: 500, message: 'Database error while creating stock and stock movement' });
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  //Handle a transfer between two locations

  // async processTransfer(dto: TransferStockDto, userId: string) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const productRepo = queryRunner.manager.getRepository(Product);
  //     const locationRepo = queryRunner.manager.getRepository(Location);
  //     const stockRepo = queryRunner.manager.getRepository(Stock);
  //     const movementRepo = queryRunner.manager.getRepository(StockMovement);

  //     // 1. Validate product ownership
  //     const product = await productRepo.findOneBy({ id: dto.productId, user: userId });
  //     if (!product) {
  //       throw new RpcException({ statusCode: 400, message: 'Product not found or not owned by user' });
  //     }

  //     // 2. Validate source location ownership
  //     const fromLocation = await locationRepo.findOneBy({ id: dto.fromLocationId, user: userId });
  //     if (!fromLocation) {
  //       throw new RpcException({ statusCode: 400, message: 'Source location not found or not owned by user' });
  //     }

  //     // 3. Validate destination location ownership
  //     const toLocation = await locationRepo.findOneBy({ id: dto.toLocationId, user: userId });
  //     if (!toLocation) {
  //       throw new RpcException({ statusCode: 400, message: 'Destination location not found or not owned by user' });
  //     }

  //     // 4. Process OUT movement from source location
  //     const sourceStock = await stockRepo.findOne({
  //       where: { product: { id: product.id }, location: { id: fromLocation.id } }
  //     });
  //     if (!sourceStock) {
  //       throw new RpcException({ statusCode: 400, message: 'Insufficient stock at source location' });
  //     }
  //     const beforeSourceQty = sourceStock.quantity;
  //     const newSourceQty = beforeSourceQty - dto.quantity;
  //     if (newSourceQty < 0) {
  //       throw new RpcException({ statusCode: 400, message: 'Insufficient stock at source location' });
  //     }
  //     sourceStock.quantity = newSourceQty;
  //     sourceStock.user = userId; // audit field
  //     await stockRepo.save(sourceStock);

  //     const sourceMovement = movementRepo.create({
  //       type: StockMovementType.TRANSFER,
  //       quantityChange: -dto.quantity,
  //       beforeQuantity: beforeSourceQty,
  //       afterQuantity: newSourceQty,
  //       referenceId: dto.referenceId,
  //       reason: dto.reason,
  //       user: userId,
  //       stock: sourceStock,
  //     });
  //     await movementRepo.save(sourceMovement);

  //     // 5. Process IN movement to destination location
  //     let destStock = await stockRepo.findOne({
  //       where: { product: { id: product.id }, location: { id: toLocation.id } }
  //     });
  //     if (!destStock) {
  //       destStock = stockRepo.create({
  //         product,
  //         location: toLocation,
  //         quantity: 0,
  //         user: userId,
  //       });
  //     }
  //     const beforeDestQty = destStock.quantity;
  //     const newDestQty = beforeDestQty + dto.quantity;
  //     destStock.quantity = newDestQty;
  //     destStock.user = userId;
  //     await stockRepo.save(destStock);

  //     const destMovement = movementRepo.create({
  //       type: StockMovementType.TRANSFER,
  //       quantityChange: dto.quantity,
  //       beforeQuantity: beforeDestQty,
  //       afterQuantity: newDestQty,
  //       referenceId: dto.referenceId,
  //       reason: dto.reason,
  //       user: userId,
  //       stock: destStock,
  //     });
  //     await movementRepo.save(destMovement);

  //     await queryRunner.commitTransaction();

  //     return {
  //       source: { stock: sourceStock, movement: sourceMovement },
  //       destination: { stock: destStock, movement: destMovement },
  //     };
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  //Get current stock for a product and location


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

  async reciveStock(reciveStockDto: ReceiveStockDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const stockRepo = queryRunner.manager.getRepository(Stock);
      const movementRepo = queryRunner.manager.getRepository(StockMovement);
      const productRepo = queryRunner.manager.getRepository(Product);
      const locationRepo = queryRunner.manager.getRepository(Location);

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


  // async getStocks(userId: string, filters: GetStocksQueryDto) {
  //   const where: any = { user: userId };
  //   if (filters.locationId) where.location = filters.locationId;
  //   if (filters.productId) where.product = filters.productId;

  //   try {
  //     const stocks = await this.dataSource.getRepository(Stock).findOne({
  //       where
  //     });
  //     if (!stocks) {
  //       throw new RpcException({ statusCode: 400, message: 'Stock not found' });
  //     }
  //     return { where, stocks };
  //   } catch (error) {
  //     handleRpcException(error, "Database error while getting stock");
  //   }

  // }
}