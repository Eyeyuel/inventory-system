import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { CreateMovementDto, TransferStockDto } from '@inventory-system/dto';
import { Stock } from '../stock/entities/stock.entity';
import { StockMovementType } from '@inventory-system/types';
import { StockMovement } from '../stockMovement/entities/stock-movement.entity';
import { RpcException } from '@nestjs/microservices';
import { Product } from '../product/entities/product.entity';
import { Location } from '../location/entities/location.entity';
import { handleRpcException } from '@inventory-system/constants';

@Injectable()
export class StockService {
  constructor(private dataSource: DataSource) { }

  /**
   * Process a single stock movement (IN/OUT/ADJUSTMENT)
   * @param dto - movement details
   * @param userId - user performing the action
   */

  async createStock(dto: CreateMovementDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const stockRepo = queryRunner.manager.getRepository(Stock);
      const movementRepo = queryRunner.manager.getRepository(StockMovement);
      const productRepo = queryRunner.manager.getRepository(Product);
      const locationRepo = queryRunner.manager.getRepository(Location);

      // 1. Validate product ownership
      const product = await productRepo.findOneBy({ id: dto.productId, user: userId });
      if (!product) {
        throw new RpcException({ statusCode: 400, message: 'Product not found or not owned by user' });
      }

      // 2. Validate location ownership
      const location = await locationRepo.findOneBy({ id: dto.locationId, user: userId });
      if (!location) {
        throw new RpcException({ statusCode: 400, message: 'Location not found or not owned by user' });
      }

      // 3. Find or create stock record (TypeScript-safe)
      const existingStock = await stockRepo.findOne({
        where: {
          product: { id: dto.productId },
          location: { id: dto.locationId }
        },
        relations: ['product', 'location']
      });

      const stock = existingStock ?? stockRepo.create({
        product: { id: dto.productId },
        location: { id: dto.locationId },
        quantity: 0,
        user: userId,
      });
      const isNewStock = !existingStock;

      // --- VALIDATION BLOCK ---
      const allowedTypes = [
        StockMovementType.OPENING_STOCK,
        StockMovementType.RECEIPT,
        StockMovementType.SHIPMENT,
        StockMovementType.ADJUSTMENT,
        StockMovementType.RETURN,
      ];
      if (!allowedTypes.includes(dto.type)) {
        throw new RpcException({ statusCode: 400, message: 'Invalid movement type for this endpoint' });
      }

      if (dto.type === StockMovementType.OPENING_STOCK || dto.type === StockMovementType.RECEIPT) {
        if (dto.quantityChange <= 0) {
          throw new RpcException({ statusCode: 400, message: `${dto.type} must have a positive quantity change` });
        }
      } else if (dto.type === StockMovementType.SHIPMENT) {
        if (dto.quantityChange >= 0) {
          throw new RpcException({ statusCode: 400, message: 'Shipment must have a negative quantity change' });
        }
      } else if (dto.type === StockMovementType.RETURN) {
        if (dto.quantityChange <= 0) {
          throw new RpcException({ statusCode: 400, message: 'Return must have a positive quantity change' });
        }
      }

      if (dto.type === StockMovementType.OPENING_STOCK && !isNewStock) {
        throw new RpcException({ statusCode: 400, message: 'Opening stock can only be set on the first movement for a product-location' });
      }
      // --- END VALIDATION ---

      const beforeQty = stock.quantity;
      const newQty = beforeQty + dto.quantityChange;
      if (newQty < 0) {
        throw new BadRequestException(`Insufficient stock at ${stock.location?.name || 'location'}`);
      }

      stock.quantity = newQty;
      stock.user = userId;
      await stockRepo.save(stock);

      const movement = movementRepo.create({
        type: dto.type,
        quantityChange: dto.quantityChange,
        beforeQuantity: beforeQty,
        afterQuantity: newQty,
        referenceId: dto.referenceId,
        reason: dto.reason,
        user: userId,
        stock,
      });
      await movementRepo.save(movement);

      await queryRunner.commitTransaction();
      return { stock, movement };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // Error handling as per your existing logic
      if (error instanceof Error) {
        throw new RpcException({ statusCode: 400, message: error.message });
      }
      if (error instanceof RpcException) throw error;
      throw new RpcException({ statusCode: 500, message: 'Database error while creating stock and stock movement' });
    } finally {
      await queryRunner.release();
    }
  }

  //Handle a transfer between two locations

  async processTransfer(dto: TransferStockDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const productRepo = queryRunner.manager.getRepository(Product);
      const locationRepo = queryRunner.manager.getRepository(Location);
      const stockRepo = queryRunner.manager.getRepository(Stock);
      const movementRepo = queryRunner.manager.getRepository(StockMovement);

      // 1. Validate product ownership
      const product = await productRepo.findOneBy({ id: dto.productId, user: userId });
      if (!product) {
        throw new RpcException({ statusCode: 400, message: 'Product not found or not owned by user' });
      }

      // 2. Validate source location ownership
      const fromLocation = await locationRepo.findOneBy({ id: dto.fromLocationId, user: userId });
      if (!fromLocation) {
        throw new RpcException({ statusCode: 400, message: 'Source location not found or not owned by user' });
      }

      // 3. Validate destination location ownership
      const toLocation = await locationRepo.findOneBy({ id: dto.toLocationId, user: userId });
      if (!toLocation) {
        throw new RpcException({ statusCode: 400, message: 'Destination location not found or not owned by user' });
      }

      // 4. Process OUT movement from source location
      const sourceStock = await stockRepo.findOne({
        where: { product: { id: product.id }, location: { id: fromLocation.id } }
      });
      if (!sourceStock) {
        throw new RpcException({ statusCode: 400, message: 'Insufficient stock at source location' });
      }
      const beforeSourceQty = sourceStock.quantity;
      const newSourceQty = beforeSourceQty - dto.quantity;
      if (newSourceQty < 0) {
        throw new RpcException({ statusCode: 400, message: 'Insufficient stock at source location' });
      }
      sourceStock.quantity = newSourceQty;
      sourceStock.user = userId; // audit field
      await stockRepo.save(sourceStock);

      const sourceMovement = movementRepo.create({
        type: StockMovementType.TRANSFER,
        quantityChange: -dto.quantity,
        beforeQuantity: beforeSourceQty,
        afterQuantity: newSourceQty,
        referenceId: dto.referenceId,
        reason: dto.reason,
        user: userId,
        stock: sourceStock,
      });
      await movementRepo.save(sourceMovement);

      // 5. Process IN movement to destination location
      let destStock = await stockRepo.findOne({
        where: { product: { id: product.id }, location: { id: toLocation.id } }
      });
      if (!destStock) {
        destStock = stockRepo.create({
          product,
          location: toLocation,
          quantity: 0,
          user: userId,
        });
      }
      const beforeDestQty = destStock.quantity;
      const newDestQty = beforeDestQty + dto.quantity;
      destStock.quantity = newDestQty;
      destStock.user = userId;
      await stockRepo.save(destStock);

      const destMovement = movementRepo.create({
        type: StockMovementType.TRANSFER,
        quantityChange: dto.quantity,
        beforeQuantity: beforeDestQty,
        afterQuantity: newDestQty,
        referenceId: dto.referenceId,
        reason: dto.reason,
        user: userId,
        stock: destStock,
      });
      await movementRepo.save(destMovement);

      await queryRunner.commitTransaction();

      return {
        source: { stock: sourceStock, movement: sourceMovement },
        destination: { stock: destStock, movement: destMovement },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //Get current stock for a product and location

  async getStocks(userId: string) {
    try {
      const stocks = await this.dataSource.getRepository(Stock).findOne({
        where: { user: userId }, relations: ['product', 'location']
      });
      if (!stocks) {
        throw new RpcException({ statusCode: 400, message: 'Stock not found' });
      }
      return stocks;
    } catch (error) {
      handleRpcException(error, "Database error while getting stock");
    }

  }
}